// server.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { error } from 'console';
dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://192.168.50.56:5173",
    "https://192.168.50.56:5173",
  ],
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ====== Multer setup for official signatures and profile pictures ======
const signaturesDir = 'uploads/signatures';
fs.mkdirSync(signaturesDir, { recursive: true });

// FIX: Create needed upload folders
fs.mkdirSync('uploads/profile_pictures', { recursive: true });
fs.mkdirSync("uploads/events", { recursive: true });

// ====== Multer setup for events ======
const eventsDir = 'uploads/events';
fs.mkdirSync(eventsDir, { recursive: true });

const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadEvents = multer({
  storage: eventStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  }
});

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'signature') {
      cb(null, 'uploads/signatures');
    } else if (file.fieldname === 'profile_img') {
      cb(null, 'uploads/profile_pictures');
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: multerStorage });

// ====== Multer setup for settings ======
const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

const settingsAssetDir = "uploads/company_asset";
fs.mkdirSync(settingsAssetDir, { recursive: true });

const settingsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, settingsAssetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const settingsUpload = multer({
  storage: settingsStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return cb(
        new Error(`Invalid file type: ${ext}. Allowed types: ${allowedExtensions.join(", ")}`),
        false
      );
    }

    cb(null, true);
  },
});

// ====== MySQL Database Connetion ====== 
const getDbHost = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DB_HOST_PUBLIC;
  } else if (process.env.NODE_ENV === 'local') {
    return process.env.DB_HOST_LOCAL;
  } else {
    return 'localhost'; // fallback for development
  }
};

// MySQL connection pool
const pool = mysql.createPool({
  host: getDbHost(),
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'barangay_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ===== SECRET KEY ======
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// ===== Helper: token from header =====
function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return authHeader;
}

// ===== Middleware: verify token =====
function verifyToken(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role, full_name }
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ===================== FORGOT PASSWORD =====================
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email not found." });
    }

    const newPassword = generateRandomPassword();
    const password_hash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = ? WHERE username = ?",
      [password_hash, normalizedEmail]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Barangay System" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Password Reset Successful",
      text: `
Your password has been reset successfully.

NEW PASSWORD:
${newPassword}

Please log in and change your password immediately.
`,
    });

    res.json({ message: "A new password has been sent to your email." });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to reset password." });
  }
});


// ===================== AUTH =====================
// GLOBAL AUTH STORE
let otpStore = {};
let loginAttempts = {};

// OTP GENERATOR
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/request-otp
app.post("/api/auth/request-otp", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Email or Username is required" });

  const normalized = username.trim().toLowerCase();

  const [existingUser] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [normalized]
  );

  if (existingUser.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  const now = Date.now();
  const existing = otpStore[normalized];

  // Cooldown check
  if (existing && existing.cooldownUntil > now) {
    const left = Math.ceil((existing.cooldownUntil - now) / 1000);
    return res.status(429).json({ message: `OTP already sent. Wait ${left}s.` });
  }

  const otp = generateOTP();

  // Store OTP for this username/email
  otpStore[normalized] = {
    otp,
    expiresAt: now + 5 * 60 * 1000,
    cooldownUntil: now + 60 * 1000,
  };

  try {
    const [settings] = await pool.query("SELECT company_name FROM company_settings LIMIT 1");
    const shortTerm = settings?.[0]?.company_name || "Barangay";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${shortTerm} OTP Verification" <${process.env.EMAIL_USER}>`,
      to: normalized,
      subject: `${shortTerm} OTP Code`,
      text: `Your OTP is: ${otp} (Valid for 5 minutes)`,
    });

    console.log(`OTP sent to ${normalized}: ${otp}`);

    res.json({ message: `${shortTerm} OTP sent to your email.` });
  } catch (err) {
    console.error("OTP Send Error:", err);
    delete otpStore[normalized];
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// POST /api/verify-otp
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { username, otp } = req.body;
    if (!username || !otp) return res.status(400).json({ message: "Username and OTP are required" });

    const id = username.trim().toLowerCase();
    const stored = otpStore[id];
    if (!stored) return res.status(400).json({ message: "No OTP request found" });
    if (stored.expiresAt < Date.now()) {
      delete otpStore[id];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }
    if (stored.otp !== otp.trim()) return res.status(400).json({ message: "Invalid OTP." });

    delete otpStore[id];

    // Fetch user
    const [users] = await pool.query("SELECT * FROM users WHERE username = ? LIMIT 1", [id]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const user = users[0];

    const payload = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    res.json({ token, user: payload, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PAGE_ACCESS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'residents', label: 'Residents' },
  { key: 'households', label: 'Households' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'services', label: 'Services' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'officials', label: 'Officials' },
  { key: 'calendarpage', label: 'Calendar' },
  { key: 'settings', label: 'Barangay Profile' },
  { key: 'auditpage', label: 'History Logs' },
  { key: 'adminsecuritysettings', label: 'Settings' },
  { key: 'residentidcard', label: 'Resident ID Card' },
];

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Check login attempts
    const now = Date.now();
    const record = loginAttempts[username] || { count: 0, lockUntil: null };

    if (record.lockUntil && record.lockUntil > now) {
      const secondsLeft = Math.ceil((record.lockUntil - now) / 1000);
      return res.status(429).json({ message: `Too many failed attempts. Try again in ${secondsLeft}s.` });
    }

    // Fetch user
    const [users] = await pool.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username.trim()]);
    if (users.length === 0) {
      record.count++;
      if (record.count >= 3) {
        record.lockUntil = now + 3 * 60 * 1000; // 3 min lock
      }
      loginAttempts[username] = record;
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = users[0];

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      record.count++;
      if (record.count >= 3) {
        record.lockUntil = now + 3 * 60 * 1000;
      }
      loginAttempts[username] = record;

      const remaining = Math.max(0, 3 - record.count);
      return res.status(401).json({
        message: `Invalid password. You have ${remaining} attempt(s) remaining.`,
      });
    }

    const pages = await query(
      `SELECT page_key 
      FROM page_access 
      WHERE official_id = ?`,
      [user.official_id]
    );

    const pageAccess = pages.map(p => p.page_key);

    // If OTP is required
    user.require_otp = Number(user.require_otp) === 1;
    if (user.require_otp) {
      const otp = generateOTP();
      otpStore[user.username] = {
        otp,
        expiresAt: now + 5 * 60 * 1000,
        cooldownUntil: now + 60 * 1000,
      };

      // send OTP via email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
        to: username, // only works if username is an email
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. Valid for 5 minutes.`,
      });

      // DO NOT return token here
      return res.json({
        require_otp: true,
        message: "OTP sent to your email",
      });
    }

    // Clear login attempts on success
    delete loginAttempts[username];

    // Generate JWT token
    const payload = {
      id: user.id,
      official_id: user.official_id,
      profile_image: user.profile_image,
      username: user.username,
      full_name: user.full_name,   // ✅ CORRECT
      role: user.role,             // ✅ CORRECT
      page_access: pageAccess,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: payload,               // ✅ CORRECT
      require_otp: user.require_otp,
    });


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', verifyToken, async (req, res) => {
  try {
    const { official_id, username, password, full_name, role, require_otp, page_access = [] } = req.body;

    // Validation
    if (!official_id || !username || !password || !full_name) {
      return res.status(400).json({
        message: 'official_id, username, password, and full_name are required.',
      });
    }

    // Check if username exists
    const existingUser = await query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Username already taken.',
      });
    }

    const existingOfficial = await query(
      'SELECT id FROM users WHERE official_id = ?',
      [official_id]
    );
    if (existingOfficial.length > 0) {
      return res.status(409).json({
        message: 'This official already has an account.',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users 
        (official_id, username, password_hash, full_name, role, require_otp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        official_id,
        username,
        password_hash,
        full_name,
        role || 'user',
        require_otp ? 1 : 0,
      ]
    );

    /* 🔹 INSERT PAGE ACCESS */
    if (page_access.length > 0) {
      const values = page_access.map((key) => {
        const page = PAGE_ACCESS.find((p) => p.key === key);
        return [official_id, key, page?.label || key];
      });

      await query(
        `INSERT INTO page_access (official_id, page_key, page_label)
         VALUES ?`,
        [values]
      );
    }

    const created = await query(
      `SELECT id, official_id, username, full_name, role, require_otp
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({
      message: 'Error registering user',
    });
  }
});

// GET /api/auth/me (current user)
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id,
        official_id,
        username,
        full_name,
        profile_image,
        role,
        require_otp
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const pages = await pool.query(
      `SELECT page_key FROM page_access WHERE official_id = ?`,
      [rows[0].official_id]
    );

    res.json({
      ...rows[0],
      page_access: pages[0].map(p => p.page_key),
    });

  } catch (err) {
    console.error("Fetch me error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/user/security-settings
app.put("/api/user/security-settings", verifyToken, async (req, res) => {
  try {
    const { require_otp } = req.body;
    const userId = req.user.id;

    await pool.query(
      "UPDATE users SET require_otp = ? WHERE id = ?",
      [require_otp ? 1 : 0, userId]
    );

    res.json({ message: "Security settings updated" });
  } catch (err) {
    console.error("Error updating security settings:", err);
    res.status(500).json({ message: "Failed to update security settings" });
  }
});

// PUT /api/user/profile
app.put("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { full_name } = req.body;
    const userId = req.user.id;

    await pool.query(
      "UPDATE users SET full_name = ? WHERE id = ?",
      [full_name, userId]
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// PUT /api/user/change-password
app.put("/api/user/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// PUT /user/security-settings
app.put("/user/security-settings", verifyToken, async (req, res) => {
  try {
    const { full_name, require_otp, currentPassword, newPassword } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // PASSWORD CHANGE (optional)
    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

      if (!match) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [hashed, user.id]
      );
    }

    // OTP + NAME (safe even if undefined)
    await pool.query(
      "UPDATE users SET full_name = COALESCE(?, full_name), require_otp = ? WHERE id = ?",
      [full_name, require_otp ? 1 : 0, user.id]
    );

    res.json({ message: "Security settings updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ===================== SETTINGS =====================
// PUBLIC: visiting or not currently login users
app.get('/api/public/settings', async (req, res) => {
  try {
    const rows = await query("SELECT * FROM company_settings WHERE id = 1");
    return res.json(rows[0] || {});
  } catch (err) {
    console.error("❌ Error fetching public settings:", err);
    res.status(500).json({ error: err.message });
  }
});

// PRIVATE: settings management (Authorize User Only)
app.put("/api/settings", verifyToken,
  settingsUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bg_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      // FETCH EXISTING SETTINGS FIRST
      const rows = await query("SELECT * FROM company_settings WHERE id = 1");
      const old = rows[0] || {};

      // NEW FILES (OPTIONAL)
      const newLogo = req.files["logo"]
        ? `/uploads/company_asset/${req.files["logo"][0].filename}`
        : old.logo_url;

      const newBg = req.files["bg_image"]
        ? `/uploads/company_asset/${req.files["bg_image"][0].filename}`
        : old.bg_image;

      // MERGED (OLD + NEW)
      const merged = {
        company_name: body.company_name !== "" ? body.company_name : old.company_name,
        address: body.address !== "" ? body.address : old.address,
        footer_text: body.footer_text !== "" ? body.footer_text : old.footer_text,

        header_color: body.header_color !== "" ? body.header_color : old.header_color,
        footer_color: body.footer_color !== "" ? body.footer_color : old.footer_color,
        main_button_color: body.main_button_color !== "" ? body.main_button_color : old.main_button_color,
        sidebar_button_color: body.sidebar_button_color !== "" ? body.sidebar_button_color : old.sidebar_button_color,

        logo_url: newLogo,
        bg_image: newBg,

        ip_address: body.ip_address !== "" ? body.ip_address : old.ip_address,
      };

      // SAVE MERGED DATA
      await query(
        `UPDATE company_settings SET
    company_name=?, address=?, ip_address=?, header_color=?, footer_text=?, footer_color=?,
    logo_url=?, bg_image=?, main_button_color=?, sidebar_button_color=?
   WHERE id = 1`,
        [
          merged.company_name,
          merged.address,
          merged.ip_address, // ✅ NEW
          merged.header_color,
          merged.footer_text,
          merged.footer_color,
          merged.logo_url,
          merged.bg_image,
          merged.main_button_color,
          merged.sidebar_button_color,
        ]
      );

      return res.json({ success: true, message: "Settings updated successfully." });
    } catch (err) {
      console.error("❌ Error in /api/settings:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ===================== RESIDENTS =====================

async function generateResidentCode(connection) {
  const year = new Date().getFullYear();

  // Lock row to avoid duplicates
  const [rows] = await connection.query(
    "SELECT last_number FROM resident_sequences WHERE year = ? FOR UPDATE",
    [year]
  );

  let nextNumber = 1;

  if (rows.length === 0) {
    await connection.query(
      "INSERT INTO resident_sequences (year, last_number) VALUES (?, ?)",
      [year, nextNumber]
    );
  } else {
    nextNumber = rows[0].last_number + 1;
    await connection.query(
      "UPDATE resident_sequences SET last_number = ? WHERE year = ?",
      [nextNumber, year]
    );
  }

  const padded = String(nextNumber).padStart(5, "0");
  return `${year}-${padded}`;
}

app.post('/api/residents', upload.single('profile_img'), verifyToken, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const resident_code = await generateResidentCode(connection);

    const {
      last_name,
      first_name,
      middle_name,
      suffix,
      sex,
      age,
      email_address,
      is_senior,
      is_solo_parent,
      birthdate,
      civil_status,
      work,
      monthly_income,
      contact_no,
      purok,
      address,
      is_voters,
      precint_no,
      fullname_emergency,
      contact_no_emergency,
      status,
      is_pwd,
      living
    } = req.body;

    if (!last_name || !first_name || !sex) {
      await connection.rollback();
      return res.status(400).json({
        message: 'last_name, first_name, and sex are required.'
      });
    }

    if (!last_name || !first_name || !sex) {
      await connection.rollback();
      return res.status(400).json({
        message: 'last_name, first_name, and sex are required.'
      });
    }

    const residentExists = await connection.query(
      "SELECT id FROM residents WHERE first_name = ? AND last_name = ? AND birthdate = ? LIMIT 1",
      [first_name, last_name, birthdate]
    );

    if (residentExists[0].length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: 'Resident is already exists.'
      });
    }

    const normalizedIsPwd =
      is_pwd === 1 || is_pwd === "1" || is_pwd === true ? 1 : 0;

    const normalizedIsSenior =
      is_senior === 1 || is_senior === "1" || is_senior === true ? 1 : 0;

    const normalizedIsSoloParent =
      is_solo_parent === 1 || is_solo_parent === "1" || is_solo_parent === true ? 1 : 0;

    const profile_picture = req.file
      ? `/uploads/profile_pictures/${req.file.filename}`
      : null;

    const [result] = await connection.query(
      `INSERT INTO residents (
        resident_code,
        profile_picture,
        last_name,
        first_name,
        middle_name,
        suffix,
        sex,
        age,
        email_address,
        is_senior,
        is_solo_parent,
        birthdate,
        civil_status,
        work,
        monthly_income,
        contact_no,
        purok,
        address,
        is_voters,
        precint_no,
        fullname_emergency,
        contact_no_emergency,
        status,
        is_pwd,
        living,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        resident_code,
        profile_picture,
        last_name,
        first_name,
        middle_name,
        suffix,
        sex,
        age,
        email_address,
        normalizedIsSenior,
        normalizedIsSoloParent,
        birthdate,
        civil_status,
        work,
        monthly_income,
        contact_no,
        purok,
        address,
        is_voters ?? 0,
        precint_no,
        fullname_emergency,
        contact_no_emergency,
        status ?? 1,
        normalizedIsPwd,
        living || null
      ]
    );

    await connection.commit();

    const [created] = await connection.query(
      'SELECT * FROM residents WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(created[0]);

  } catch (err) {
    await connection.rollback();
    console.error('Error creating resident:', err);
    res.status(500).json({ message: 'Error creating resident' });
  } finally {
    connection.release();
  }
});

// Public resident view (robust)
app.get("/api/public/resident/:code", async (req, res) => {
  try {
    let { code } = req.params;
    code = code.trim();

    const [rows] = await pool.query(
      `SELECT
        r.resident_code,
        r.profile_picture,
        r.last_name,
        r.first_name,
        r.middle_name,
        r.suffix,
        r.sex,
        r.age,
        r.email_address,
        r.birthdate,
        r.civil_status,
        r.contact_no,
        r.purok,
        r.address,
        r.is_voters,
        r.fullname_emergency,
        r.contact_no_emergency,
        r.is_pwd,
        r.is_solo_parent,
        r.status
      FROM residents r
      WHERE r.resident_code = ?
         OR r.id = CAST(? AS UNSIGNED)
      LIMIT 1`,
      [code, code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Public resident view error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/public/resident/:code/:types/:issued", async (req, res) => {
  try {
    let { code, types, issued } = req.params;

    code = code.trim();
    const doctypes = decodeURIComponent(types).trim();
    const date = decodeURIComponent(issued).trim();

    const [rows] = await pool.query(
      `SELECT
        r.resident_code,
        r.profile_picture,
        r.last_name,
        r.first_name,
        r.middle_name,
        r.suffix,
        r.sex,
        r.age,
        r.email_address,
        r.birthdate,
        r.civil_status,
        r.contact_no,
        r.purok,
        r.address,
        r.is_voters,
        r.fullname_emergency,
        r.contact_no_emergency,
        r.is_pwd,
        r.is_solo_parent,
        r.status,
        dr.document_types,
        dr.valid_until
      FROM residents r
      INNER JOIN document_requested dr ON r.id = dr.resident_id
      WHERE (r.resident_code = ? AND dr.document_types = ? AND dr.issued_at = ?)
         OR r.id = CAST(? AS UNSIGNED)
      LIMIT 1`,
      [code, doctypes, date, code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Public resident view error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/residents/:id', upload.single('profile_img'), verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query('SELECT * FROM residents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const old = existing[0];

    const {
      last_name,
      first_name,
      middle_name,
      suffix,
      sex,
      age,
      email_address,
      is_senior,
      is_solo_parent,
      birthdate,
      civil_status,
      work,
      monthly_income,
      contact_no,
      purok,
      address,
      is_voters,
      precint_no,
      fullname_emergency,
      contact_no_emergency,
      status,
      is_pwd,
      living,
    } = req.body;

    const profile_picture = req.file
      ? `/uploads/profile_pictures/${req.file.filename}`
      : old.profile_picture;

    const normalizedIsPwd =
      is_pwd === 1 || is_pwd === "1" || is_pwd === true
        ? 1
        : is_pwd === 0 || is_pwd === "0"
          ? 0
          : old.is_pwd;

    const normalizedIsSenior =
      is_senior === 1 || is_senior === "1" || is_senior === true
        ? 1
        : is_senior === 0 || is_senior === "0"
          ? 0
          : old.is_senior;

    const normalizedIsSoloParent =
      is_solo_parent === 1 || is_solo_parent === "1" || is_solo_parent === true
        ? 1
        : is_solo_parent === 0 || is_solo_parent === "0"
          ? 0
          : old.is_solo_parent;

    await query(
      `UPDATE residents SET
        profile_picture = ?,
        last_name = ?,
        first_name = ?,
        middle_name = ?,
        suffix = ?,
        sex = ?,
        age = ?,
        email_address = ?,
        is_senior = ?,
        is_solo_parent = ?,
        birthdate = ?,
        civil_status = ?,
        work = ?,
        monthly_income = ?,
        contact_no = ?,
        purok = ?,
        address = ?,
        is_voters = ?,
        precint_no = ?,
        fullname_emergency = ?,
        contact_no_emergency = ?,
        status = ?,
        is_pwd = ?,
        living = ?
      WHERE id = ?`,
      [
        profile_picture,
        last_name ?? old.last_name,
        first_name ?? old.first_name,
        middle_name ?? old.middle_name,
        suffix ?? old.suffix,
        sex ?? old.sex,
        age ?? old.age,
        email_address && email_address.trim() !== ""
          ? email_address
          : old.email_address,

        normalizedIsSenior,
        normalizedIsSoloParent,
        birthdate ?? old.birthdate,
        civil_status ?? old.civil_status,
        work ?? old.work,
        monthly_income ?? old.monthly_income,
        contact_no ?? old.contact_no,
        purok ?? old.purok,
        address ?? old.address,
        is_voters ?? old.is_voters,
        precint_no ?? old.precint_no,
        fullname_emergency ?? old.fullname_emergency,
        contact_no_emergency ?? old.contact_no_emergency,
        status ?? old.status,
        normalizedIsPwd,
        living ?? old.living,
        id
      ]
    );

    const updated = await query('SELECT * FROM residents WHERE id = ?', [id]);
    res.json(updated[0]);

  } catch (err) {
    console.error('Error updating resident:', err);
    res.status(500).json({ message: 'Error updating resident' });
  }
});

app.delete('/api/residents/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Check if resident exists
    const [existing] = await connection.query(
      'SELECT id FROM residents WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Delete resident
    await connection.query(
      'DELETE FROM residents WHERE id = ?',
      [id]
    );

    await connection.commit();

    res.json({
      message: 'Resident deleted successfully'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error deleting resident:', err);
    res.status(500).json({ message: 'Error deleting resident' });
  } finally {
    connection.release();
  }
});



// GET /api/residents - public view
app.get('/api/residents', async (req, res) => {
  try {
    const residents = await query(
      'SELECT * FROM residents ORDER BY last_name, first_name'
    );
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents:', err);
    res.status(500).json({ message: 'Error fetching residents' });
  }
});

// POST /api/request_id/ - submit 
app.post("/api/request-id", verifyToken, async (req, res) => {
  try {
    const { resident_id, precinct_no, id_number, date_issue, valid_until } = req.body;

    const sql = `
      INSERT INTO request_id_table 
      (resident_id, precint_no, id_number, date_issue, valid_until)
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [resident_id, precinct_no, id_number, date_issue, valid_until]);

    res.json({ message: "Request submitted successfully" });

  } catch (err) {
    console.error("❌ Error inserting ID request:", err);
    res.status(500).json({ error: err.message });
  }
});

// BULK IMPORT RESIDENTS (OPTIONAL FIELDS)
app.post("/api/residents/bulk", verifyToken, async (req, res) => {
  try {
    const residents = req.body;

    if (!Array.isArray(residents) || residents.length === 0) {
      return res.status(400).json({ message: "No residents data received" });
    }

    for (const r of residents) {
      const bulkIsPwd =
        r.is_pwd === 1 || r.is_pwd === "1" || r.is_pwd === true ? 1 : 0;

      const bulkIsSoloParent =
        r.is_solo_parent === 1 || r.is_solo_parent === "1" || r.is_solo_parent === true ? 1 : 0;

      await pool.query(
        `INSERT INTO residents (
          profile_picture,
          last_name,
          first_name,
          middle_name,
          suffix,
          sex,
          age,
          birthdate,
          civil_status,
          work,
          monthly_income,
          contact_no,
          purok,
          address,
          is_voters,
          precint_no,
          fullname_emergency,
          contact_no_emergency,
          status,
          is_pwd,
          is_solo_parent,
          living
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          null,
          r.last_name || null,
          r.first_name || null,
          r.middle_name || null,
          r.suffix || null,
          r.sex || null,
          r.age || null,
          r.birthdate || null,
          r.civil_status || null,
          r.work || null,
          r.monthly_income || null,
          r.contact_no || null,
          r.purok || null,
          r.address || null,
          r.is_voters ? 1 : 0,
          r.precint_no || null,
          r.fullname_emergency || null,
          r.contact_no_emergency || null,
          1,
          bulkIsPwd,
          bulkIsSoloParent,
          r.living || null
        ]
      );
    }

    res.json({ message: "Residents imported successfully" });
  } catch (err) {
    console.error("Bulk import error:", err);
    res.status(500).json({ message: "Failed to import residents" });
  }
});


const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action"
      });
    }
    next();
  };
};

app.post(
  "/api/residents/:id/notify-id-claim",
  verifyToken,
  allowRoles("Admin", "SuperAdmin", "User"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [residents] = await pool.query(
        `SELECT first_name, last_name, email_address
         FROM residents
         WHERE id = ?`,
        [id]
      );

      if (residents.length === 0) {
        return res.status(404).json({ message: "Resident not found" });
      }

      const resident = residents[0];

      if (!resident.email_address) {
        return res.status(400).json({
          message: "Resident has no email address"
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Barangay Office (${req.user.role})" <${process.env.EMAIL_USER}>`,
        to: resident.email_address,
        subject: "Barangay ID Ready for Claiming",
        html: `
          <p>Good day <strong>${resident.first_name} ${resident.last_name}</strong>,</p>
          <p>Your <strong>Barangay ID</strong> is now ready for claiming.</p>
          <p>Please bring a <strong>valid ID</strong> to the barangay hall.</p>
          <br />
          <p>Thank you,<br />Barangay Hall</p>
        `
      });

      res.json({ message: "Resident notified successfully" });

    } catch (err) {
      console.error("Notify ID error:", err);
      res.status(500).json({ message: "Failed to send email" });
    }
  }
);



// ===================== HOUSEHOLDS =====================

// GET /api/households
app.get('/api/households', async (req, res) => {
  try {
    const households = await query(
      `SELECT h.*,
              COUNT(hm.id) AS member_count
       FROM households h
       LEFT JOIN household_members hm ON hm.household_id = h.id
       GROUP BY h.id
       ORDER BY h.household_name`
    );
    res.json(households);
  } catch (err) {
    console.error('Error fetching households:', err);
    res.status(500).json({ message: 'Error fetching households' });
  }
});

// POST /api/households (protected)
app.post('/api/households', verifyToken, async (req, res) => {
  try {
    const { household_name, address, purok } = req.body;

    if (!household_name || !address) {
      return res
        .status(400)
        .json({ message: 'household_name and address are required.' });
    }

    const result = await query(
      `INSERT INTO households (household_name, address, purok)
       VALUES (?, ?, ?)`,
      [household_name, address, purok]
    );

    const created = await query('SELECT * FROM households WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error creating household:', err);
    res.status(500).json({ message: 'Error creating household' });
  }
});

// PUT /api/households/:id (protected)
app.put('/api/households/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { household_name, address, purok } = req.body;

    await query(
      `UPDATE households
       SET household_name = ?, address = ?, purok = ?
       WHERE id = ?`,
      [household_name, address, purok, id]
    );

    const updated = await query('SELECT * FROM households WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating household:', err);
    res.status(500).json({ message: 'Error updating household' });
  }
});

// GET /api/households/:id/members
app.get('/api/households/:id/members', async (req, res) => {
  try {
    const householdId = req.params.id;
    const members = await query(
      `SELECT hm.id,
              r.id AS resident_id,
              r.first_name,
              r.last_name,
              hm.relation_to_head
       FROM household_members hm
       JOIN residents r ON r.id = hm.resident_id
       WHERE hm.household_id = ?
       ORDER BY r.last_name, r.first_name`,
      [householdId]
    );
    res.json(members);
  } catch (err) {
    console.error('Error fetching household members:', err);
    res.status(500).json({ message: 'Error fetching household members' });
  }
});

// POST /api/households/:id/members (protected)
app.post('/api/households/:id/members', verifyToken, async (req, res) => {
  try {
    const householdId = req.params.id;
    const { resident_id, relation_to_head } = req.body;

    if (!resident_id) {
      return res
        .status(400)
        .json({ message: 'resident_id is required to add member.' });
    }

    const result = await query(
      `INSERT INTO household_members (household_id, resident_id, relation_to_head)
       VALUES (?, ?, ?)`,
      [householdId, resident_id, relation_to_head]
    );

    const created = await query(
      `SELECT hm.id,
              r.id AS resident_id,
              r.first_name,
              r.last_name,
              hm.relation_to_head
       FROM household_members hm
       JOIN residents r ON r.id = hm.resident_id
       WHERE hm.id = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error adding household member:', err);
    res.status(500).json({ message: 'Error adding household member' });
  }
});

app.delete('/api/households/:householdId/members/:memberId', verifyToken, async (req, res) => {
  try {
    const { householdId, memberId } = req.params;

    await pool.query(
      `DELETE FROM household_members 
       WHERE household_id = ? AND resident_id = ?`,
      [householdId, memberId]
    );

    res.json({
      message: "Member successfully removed from household",
    });
  } catch (err) {
    console.error("Error dropping household member:", err);
    res.status(500).json({
      message: "Error dropping household member",
    });
  }
});

// DELETE /api/households/:id (protected)
app.delete('/api/households/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Check if household exists
    const [existing] = await connection.query(
      'SELECT id FROM households WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Household not found' });
    }

    // Delete all members first
    await connection.query(
      'DELETE FROM household_members WHERE household_id = ?',
      [id]
    );

    // Delete household
    await connection.query(
      'DELETE FROM households WHERE id = ?',
      [id]
    );

    await connection.commit();

    res.json({
      message: 'Household deleted successfully',
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error deleting household:', err);
    res.status(500).json({ message: 'Error deleting household' });
  } finally {
    connection.release();
  }
});


// ===================== INCIDENTS =====================

// GET /api/incidents
app.get('/api/incidents', async (req, res) => {
  try {
    const incidents = await query(
      `SELECT i.*,
              c.first_name AS complainant_first_name,
              c.last_name AS complainant_last_name,
              r.first_name AS respondent_first_name,
              r.last_name AS respondent_last_name
       FROM incidents i
       LEFT JOIN residents c ON c.id = i.complainant_id
       LEFT JOIN residents r ON r.id = i.respondent_id
       ORDER BY i.incident_date DESC`
    );
    res.json(incidents);
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).json({ message: 'Error fetching incidents' });
  }
});

// POST /api/incidents (protected)
app.post('/api/incidents', verifyToken, async (req, res) => {
  try {
    const {
      incident_date,
      incident_type,
      location,
      description,
      complainant_id,
      respondent_id,
      status,
    } = req.body;

    if (!incident_date || !incident_type) {
      return res
        .status(400)
        .json({ message: 'incident_date and incident_type are required.' });
    }

    const result = await query(
      `INSERT INTO incidents
       (incident_date, incident_type, location, description,
        complainant_id, respondent_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        incident_date,
        incident_type,
        location,
        description,
        complainant_id,
        respondent_id,
        status || 'Open',
      ]
    );

    const created = await query('SELECT * FROM incidents WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error creating incident:', err);
    res.status(500).json({ message: 'Error creating incident' });
  }
});

// PUT /api/incidents/:id (protected)
app.put('/api/incidents/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      incident_date,
      incident_type,
      location,
      description,
      complainant_id,
      respondent_id,
      status,
    } = req.body;

    await query(
      `UPDATE incidents
       SET incident_date = ?, incident_type = ?, location = ?,
           description = ?, complainant_id = ?, respondent_id = ?, status = ?
       WHERE id = ?`,
      [
        incident_date,
        incident_type,
        location,
        description,
        complainant_id,
        respondent_id,
        status || 'Open',
        id,
      ]
    );

    const updated = await query('SELECT * FROM incidents WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating incident:', err);
    res.status(500).json({ message: 'Error updating incident' });
  }
});

app.delete('/api/incidents/:id', verifyToken, async (req, res) => {
  try {
    const incidentID = req.params.id;

    await pool.query('DELETE FROM incidents WHERE id = ?', [incidentID]);

    res.json({ message: "The record successfully deleted" });
  } catch (err) {
    console.error('Error in deleting incidents:', err);
    res.status(500).json({ message: 'Error in deleting incidents' });
  }
})

// ===================== SERVICES =====================

// GET /api/services
app.get('/api/services', async (req, res) => {
  try {
    const services = await query(
      `SELECT s.*,
              COUNT(sb.id) AS beneficiary_count
       FROM services s
       LEFT JOIN service_beneficiaries sb ON sb.service_id = s.id
       GROUP BY s.id
       ORDER BY s.service_date DESC, s.service_name`
    );
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

// POST /api/services (protected)
app.post('/api/services', verifyToken, async (req, res) => {
  try {
    const { service_name, description, service_date, location } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: 'service_name is required.' });
    }

    const result = await query(
      `INSERT INTO services (service_name, description, service_date, location)
       VALUES (?, ?, ?, ?)`,
      [service_name, description, service_date, location]
    );

    const created = await query('SELECT * FROM services WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: 'Error creating service' });
  }
});

// PUT /api/services/:id (protected)
app.put('/api/services/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, description, service_date, location } = req.body;

    await query(
      `UPDATE services
       SET service_name = ?, description = ?, service_date = ?, location = ?
       WHERE id = ?`,
      [service_name, description, service_date, location, id]
    );

    const updated = await query('SELECT * FROM services WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Error updating service' });
  }
});

// GET /api/services/:id/beneficiaries
app.get('/api/services/:id/beneficiaries', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const beneficiaries = await query(
      `SELECT sb.id,
              r.id AS resident_id,
              sb.fullname,
              sb.address,
              sb.age,
              sb.is_senior,
              sb.birthdate,
              sb.civil_status,
              sb.work,
              sb.monthly_income,
              sb.contact_no,
              sb.is_voters,
              sb.notes
       FROM service_beneficiaries sb
       JOIN residents r ON r.id = sb.resident_id
       WHERE sb.service_id = ?
       ORDER BY r.last_name, r.first_name`,
      [serviceId]
    );
    res.json(beneficiaries);
  } catch (err) {
    console.error('Error fetching beneficiaries:', err);
    res.status(500).json({ message: 'Error fetching beneficiaries' });
  }
});

// POST /api/services/:id/beneficiaries (protected)
app.post('/api/services/:id/beneficiaries', verifyToken, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { resident_id, fullname, address, birthdate, age, is_senior, civil_status, work, monthly_income, is_voter, contact_no, notes } = req.body;

    if (!resident_id) {
      return res
        .status(400)
        .json({ message: 'resident_id is required for beneficiary.' });
    }

    const result = await query(
      `INSERT INTO service_beneficiaries (service_id, resident_id, fullname, address, birthdate, age, is_senior, civil_status, work, monthly_income, is_voters, contact_no, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [serviceId, resident_id, fullname, address, birthdate, age, is_senior, civil_status, work, monthly_income, is_voter, contact_no, notes]
    );

    const created = await query(
      `SELECT sb.id,
              r.id AS resident_id,
              r.first_name,
              r.last_name,
              sb.notes
       FROM service_beneficiaries sb
       JOIN residents r ON r.id = sb.resident_id
       WHERE sb.id = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Error adding beneficiary:', err);
    res.status(500).json({ message: 'Error adding beneficiary' });
  }
});

app.delete('/api/services/:id', verifyToken, async (req, res) => {
  try {
    const serviceId = req.params.id;

    const ifHasBeneficiary = await query('SELECT service_id FROM service_beneficiaries WHERE service_id = ?', [serviceId]);

    if (ifHasBeneficiary.length > 0) {
      return res.status(400).json({ message: "Deleting service failed. Make sure it has no beneficiaries." })
    }

    await query("DELETE FROM services WHERE id = ?", [serviceId]);
    res.json({ message: "Delete Successfully" })
  } catch (err) {
    console.error('Error deleting beneficiary:');
    res.status(500).json({ message: 'Error Deleting Service', err });
  }
})

// PUT /api/services/:id/beneficiaries/:id
app.put('/api/services/:id/beneficiaries/:beneficiaryId', verifyToken, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const beneficiaryId = req.params.beneficiaryId;

    const { resident_id, fullname, address, birthdate, age, is_senior, civil_status, work, monthly_income, is_voter, contact_no, notes } = req.body;

    if (!resident_id) {
      return res.status(400).json({ message: 'resident_id is required' });
    }

    await query(
      `UPDATE service_beneficiaries
       SET
           fullname = ?,
           address = ?,
           birthdate = ?,
           age = ?,
           is_senior = ?,
           civil_status = ?,
           work = ?,
           monthly_income = ?,
           is_voters = ?,
           contact_no = ?,
           notes = ?
       WHERE resident_id = ? AND service_id = ?`,
      [
        fullname,
        address,
        birthdate,
        age,
        is_senior,
        civil_status,
        work,
        monthly_income,
        is_voter,
        contact_no,
        notes,
        beneficiaryId,
        serviceId
      ]
    );

    res.json({ message: 'Beneficiary updated successfully' });
  } catch (err) {
    console.error('Error updating beneficiary:', err);
    res.status(500).json({ message: 'Error updating beneficiary' });
  }
});

// DELETE /api/services/:id/beneficiaries/:id
app.delete('/api/services/:serviceID/beneficiaries/:beneficiaryID', async (req, res) => {
  try {
    const { serviceID, beneficiaryID } = req.params;

    await query(
      `DELETE FROM service_beneficiaries WHERE service_id = ? AND resident_id = ?`,
      [serviceID, beneficiaryID]
    );

    res.status(200).json({ message: 'Beneficiary removed successfully' });
  } catch (err) {
    console.error('Error fetching beneficiaries:', err);
    res.status(500).json({ message: 'Error fetching beneficiaries' });
  }
});

// Root
app.get('/', (req, res) => {
  res.send('Barangay System API running...');
});
// ===================== BARANGAY PROFILE =====================

// GET /api/barangay-profile
app.get('/api/barangay-profile', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, barangay_name, municipality, province, place_issued FROM barangay_profile LIMIT 1'
    );

    if (rows.length === 0) {
      // No record yet – send some defaults (optional)
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching barangay profile:', err);
    res.status(500).json({ message: 'Error fetching barangay profile' });
  }
});

// PUT /api/barangay-profile (protected, upsert)
app.put('/api/barangay-profile', verifyToken, async (req, res) => {
  try {
    const { barangay_name, municipality, province, place_issued } = req.body;

    if (!barangay_name || !municipality || !province) {
      return res.status(400).json({
        message: 'barangay_name, municipality, and province are required.',
      });
    }

    const existing = await query(
      'SELECT id FROM barangay_profile LIMIT 1'
    );

    if (existing.length > 0) {
      const id = existing[0].id;
      await query(
        `UPDATE barangay_profile
         SET barangay_name = ?, municipality = ?, province = ?, place_issued = ?
         WHERE id = ?`,
        [barangay_name, municipality, province, place_issued, id]
      );
    } else {
      await query(
        `INSERT INTO barangay_profile
         (barangay_name, municipality, province, place_issued)
         VALUES (?, ?, ?, ?)`,
        [barangay_name, municipality, province, place_issued]
      );
    }

    const rows = await query(
      'SELECT id, barangay_name, municipality, province, place_issued FROM barangay_profile LIMIT 1'
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error saving barangay profile:', err);
    res.status(500).json({ message: 'Error saving barangay profile' });
  }
});


// ===================== OFFICIALS =====================

// GET /api/officials
app.get('/api/officials', async (req, res) => {
  try {
    const officials = await query(
      `SELECT o.id, o.full_name, o.position, o.order_no,
              o.is_captain, o.is_secretary, o.signature_path,
              o.profile_img, CASE WHEN u.id IS NULL THEN 0 ELSE 1 END AS has_account
       FROM officials o
       LEFT JOIN users u 
        ON u.official_id = o.id
       ORDER BY order_no, position, full_name`
    );

    res.json(officials);
  } catch (err) {
    console.error('Error fetching officials:', err);
    res.status(500).json({ message: 'Error fetching officials' });
  }
});

// POST /api/officials (protected, with signature upload)
app.post(
  '/api/officials',
  verifyToken,
  upload.fields([
    { name: 'signature', maxCount: 1 },
    { name: 'profile_img', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { full_name, position, order_no, is_captain, is_secretary } = req.body;

      const signature_path = req.files?.signature
        ? `/uploads/signatures/${req.files.signature[0].filename}`
        : null;

      const profile_img = req.files?.profile_img
        ? `/uploads/profile_pictures/${req.files.profile_img[0].filename}`
        : null;

      const result = await query(
        `INSERT INTO officials
         (full_name, position, order_no, is_captain, is_secretary, signature_path, profile_img)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name,
          position,
          order_no || 0,
          is_captain === '1' ? 1 : 0,
          is_secretary === '1' ? 1 : 0,
          signature_path,
          profile_img
        ]
      );

      const created = await query('SELECT * FROM officials WHERE id = ?', [result.insertId]);
      res.status(201).json(created[0]);
    } catch (err) {
      console.error('Error creating official:', err);
      res.status(500).json({ message: 'Error creating official' });
    }
  }
);


// PUT /api/officials/:id (protected, optional new signature/profile)
app.put(
  '/api/officials/:id',
  verifyToken,
  upload.fields([
    { name: 'signature', maxCount: 1 },
    { name: 'profile_img', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name, position, order_no, is_captain, is_secretary } = req.body;

      const signature_path = req.files?.signature
        ? `/uploads/signatures/${req.files.signature[0].filename}`
        : null;

      const profile_img = req.files?.profile_img
        ? `/uploads/profile_pictures/${req.files.profile_img[0].filename}`
        : null;

      let updateSQL = `UPDATE officials SET full_name=?, position=?, order_no=?, is_captain=?, is_secretary=?`;
      const params = [full_name, position, order_no || 0, is_captain === '1' ? 1 : 0, is_secretary === '1' ? 1 : 0];

      if (signature_path) {
        updateSQL += `, signature_path=?`;
        params.push(signature_path);
      }

      if (profile_img) {
        updateSQL += `, profile_img=?`;
        params.push(profile_img);
      }

      updateSQL += ` WHERE id=?`;
      params.push(id);

      await query(updateSQL, params);
      const updated = await query('SELECT * FROM officials WHERE id = ?', [id]);
      res.json(updated[0]);
    } catch (err) {
      console.error('Error updating official:', err);
      res.status(500).json({ message: 'Error updating official' });
    }
  }
);

// DELETE /api/officials/:id (protected)
app.delete('/api/officials/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM officials WHERE id = ?', [id]);
    res.json({ message: 'Official deleted successfully' });
  } catch (err) {
    console.error('Error deleting official:', err);
    res.status(500).json({ message: 'Error deleting official' });
  }
});

// GET /api/user-by-official/:officialId (protected)
app.get('/api/user-by-official/:officialId', verifyToken, async (req, res) => {
  try {
    const { officialId } = req.params;

    // 🔹 Fetch user info
    const users = await query(
      `SELECT id, official_id, username, full_name, role, require_otp
       FROM users
       WHERE official_id = ?`,
      [officialId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No user account found for this official',
      });
    }

    const user = users[0];

    // 🔹 Fetch page access
    const pages = await query(
      `SELECT page_key, page_label
       FROM page_access
       WHERE official_id = ?`,
      [officialId]
    );

    res.json({
      ...user,
      page_access: pages.map(p => p.page_key),
    });

  } catch (err) {
    console.error('Error fetching user by official:', err);
    res.status(500).json({
      message: 'Error fetching user access',
    });
  }
});

// GET /api/update-access/:userId
app.put('/api/update-access/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, require_otp, page_access = [] } = req.body;

    // 🔹 Check user exists
    const users = await query(
      `SELECT id, official_id FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { official_id } = users[0];

    // 🔹 Update users table
    await query(
      `UPDATE users
       SET role = ?, require_otp = ?
       WHERE id = ?`,
      [
        role || 'user',
        require_otp ? 1 : 0,
        userId,
      ]
    );

    // 🔹 Remove old page access
    await query(
      `DELETE FROM page_access WHERE official_id = ?`,
      [official_id]
    );

    // 🔹 Insert new page access
    if (page_access.length > 0) {
      const values = page_access.map((key) => {
        const page = PAGE_ACCESS.find(p => p.key === key);
        return [official_id, key, page?.label || key];
      });

      await query(
        `INSERT INTO page_access (official_id, page_key, page_label)
         VALUES ?`,
        [values]
      );
    }

    res.json({
      message: 'Access updated successfully',
    });

  } catch (err) {
    console.error('Error updating access:', err);
    res.status(500).json({
      message: 'Error updating access',
    });
  }
});

// ===================== EVENTS MODULE =====================

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await query("SELECT * FROM events ORDER BY start_date DESC");

    for (let ev of events) {
      ev.images = await query(
        "SELECT id, image_path FROM event_images WHERE event_id = ?",
        [ev.id]
      );
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// GET event with photos
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await query("SELECT * FROM events WHERE id = ?", [id]);
    const images = await query(
      "SELECT * FROM event_images WHERE event_id = ?",
      [id]
    );

    res.json({ event: event[0], images });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// CREATE event
app.post('/api/events', verifyToken, async (req, res) => {
  try {
    const { title, description, start_date, end_date, start_time, end_time } = req.body;

    if (!title || !start_date || !end_date)
      return res.status(400).json({ message: "Missing required fields" });

    const result = await query(
      `INSERT INTO events (title, description, start_date, end_date, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, start_date, end_date, start_time, end_time]
    );

    res.status(201).json({ id: result.insertId, message: "Event created" });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Error creating event" });
  }
});

// UPDATE event
app.put('/api/events/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, start_time, end_time } = req.body;

    await query(
      `UPDATE events 
       SET title=?, description=?, start_date=?, end_date=?, start_time=?, end_time=? 
       WHERE id=?`,
      [title, description, start_date, end_date, start_time, end_time, id]
    );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Error updating event" });
  }
});

// UPLOAD images for event
app.post('/api/events/:id/images', verifyToken, uploadEvents.array("images", 20), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No images uploaded" });

    for (const file of req.files) {
      await query(
        `INSERT INTO event_images (event_id, image_path) VALUES (?, ?)`,
        [id, `/uploads/events/${file.filename}`]
      );
    }

    res.json({ message: "Images uploaded successfully" });
  } catch (err) {
    console.error("Error uploading event images:", err);
    res.status(500).json({ message: "Error uploading event images" });
  }
});

// DELETE event
app.delete('/api/events/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// GET /api/user/profile
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, username, full_name, role, require_otp, profile_image FROM users WHERE id = ?",
      [userId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

app.put(
  "/api/user/profile-image",
  verifyToken,
  upload.single("profile_img"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.id; // ✅ CORRECT
      const imagePath = `/uploads/profile_pictures/${req.file.filename}`;

      await pool.query(
        "UPDATE users SET profile_image = ? WHERE id = ?",
        [imagePath, userId]
      );

      res.json({ profile_image: imagePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);




app.put("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { full_name } = req.body;
    const userId = req.user.userId; // ✅ FIX

    const [result] = await pool.query(
      "UPDATE users SET full_name = ? WHERE id = ?",
      [full_name, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No user updated" });
    }

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});


// POST /api/user/otp-setting
app.post("/api/user/otp-setting", verifyToken, async (req, res) => {
  try {
    const { require_otp } = req.body;

    await pool.query(
      "UPDATE users SET require_otp = ? WHERE id = ?",
      [require_otp ? 1 : 0, req.user.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("OTP update error:", err);
    res.status(500).json({ message: "Failed to update OTP setting" });
  }
});

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Barangay System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

app.get("/api/admin/print-requests/pending", verifyToken, async (req, res) => {
  const rows = await query(`
    SELECT pr.id,
           pr.request_type,
           r.first_name,
           r.last_name,
           u.full_name AS requester_name
    FROM print_requests pr
    JOIN residents r ON r.id = pr.resident_id
    JOIN users u ON u.id = pr.requested_by
    WHERE pr.status = 'pending'
    ORDER BY pr.created_at DESC
  `);

  res.json(rows);
});

app.get(
  "/api/can-print/:resident_id/:request_type",
  verifyToken,
  async (req, res) => {
    const { resident_id, request_type } = req.params;

    // 🔓 ADMIN & SUPERADMIN CAN ALWAYS PRINT
    if (["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.json({ allowed: true, bypass: true });
    }

    // 👤 USER NEEDS APPROVAL
    const [[row]] = await pool.query(
      `SELECT id, expires_at
       FROM print_requests
       WHERE resident_id = ?
         AND request_type = ?
         AND status = 'approved'
         AND expires_at > NOW()
       ORDER BY approved_at DESC
       LIMIT 1`,
      [resident_id, request_type]
    );

    if (!row) {
      return res.json({ allowed: false });
    }

    res.json({
      allowed: true,
      expires_at: row.expires_at,
    });
  }
);

app.get("/api/admin/print-requests/approved", verifyToken, async (req, res) => {
  try {
    const rows = await query(`
      SELECT 
        pr.id,
        pr.resident_id,
        r.first_name,
        r.last_name,
        u.full_name AS requester_name,
        pr.request_type,
        pr.approved_at,
        CASE
          WHEN pr.expires_at IS NULL THEN NULL
          WHEN pr.expires_at < CURDATE() THEN 0
          ELSE DATEDIFF(pr.expires_at, CURDATE())
        END AS days_left
      FROM print_requests pr
      JOIN residents r ON r.id = pr.resident_id
      JOIN users u ON u.id = pr.requested_by
      WHERE pr.status = 'approved'
      ORDER BY pr.approved_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch approved error:", err);
    res.status(500).json({ message: "Failed to fetch approved requests" });
  }
});

app.get("/api/admin/print-requests/rejected", verifyToken, async (req, res) => {
  const rows = await query(`
    SELECT pr.id,
           pr.request_type,
           r.first_name,
           r.last_name,
           u.full_name AS requester_name
    FROM print_requests pr
    JOIN residents r ON r.id = pr.resident_id
    JOIN users u ON u.id = pr.requested_by
    WHERE pr.status = 'rejected'
    ORDER BY pr.created_at DESC
  `);

  res.json(rows);
});

app.delete("/api/admin/print-requests/approved", verifyToken, async (req, res) => {
  if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Unauthorized" });
  }


  await query(`DELETE FROM print_requests WHERE status = 'approved'`);
  res.json({ message: "Approved history deleted" });
});

app.delete("/api/admin/print-requests/rejected", verifyToken, async (req, res) => {
  if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await query(`DELETE FROM print_requests WHERE status = 'rejected'`);
  res.json({ message: "Rejected history deleted" });
});

app.get("/api/admin/print-requests/history", verifyToken, async (req, res) => {
  try {
    const rows = await query(`
      SELECT 
        pr.id,
        pr.status,
        pr.approved_at,
        pr.expires_at,
        r.first_name,
        r.last_name,
        u.full_name AS requester_name,
        CASE
          WHEN pr.expires_at IS NULL THEN NULL
          ELSE DATEDIFF(pr.expires_at, CURDATE())
        END AS days_left
      FROM print_requests pr
      JOIN residents r ON r.id = pr.resident_id
      JOIN users u ON u.id = pr.requested_by
      WHERE pr.status IN ('approved','rejected')
      ORDER BY pr.approved_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

app.delete("/api/admin/print-requests/history", verifyToken, async (req, res) => {
  try {
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await query(`
      DELETE FROM print_requests
      WHERE status IN ('approved','rejected')
    `);

    res.json({ message: "History cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear history" });
  }
});

app.put("/api/admin/print-requests/:id", verifyToken, async (req, res) => {
  try {
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status } = req.body;
    const { id } = req.params;

    const approvedAt = status === "approved" ? new Date() : null;
    const expiresAt =
      status === "approved"
        ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        : null;

    // ✅ USE SAME CONNECTION
    await pool.query(
      `UPDATE print_requests
       SET status = ?, approved_at = ?, expires_at = ?
       WHERE id = ?`,
      [status, approvedAt, expiresAt, id]
    );

    // ✅ SAME CONNECTION
    const [rows] = await pool.query(
      `SELECT u.username
       FROM print_requests pr
       JOIN users u ON pr.requested_by = u.id
       WHERE pr.id = ?`,
      [id]
    );

    if (rows.length) {
      await sendMail(
        rows[0].username,
        status === "approved"
          ? "Your Print Request Has Been Approved"
          : "Your Print Request Was Rejected",
        status === "approved"
          ? "Your request has been approved. Your ID will be processed within 2–3 business days."
          : "Sorry, your request for printing Barangay ID was rejected."
      );
    }

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update print request error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/admin/print-requests", verifyToken, async (req, res) => {
  try {
    const rows = await query(
      `SELECT 
        pr.id,
        pr.status,
        pr.created_at,
        r.first_name,
        r.last_name,
        u.full_name AS requester_name,
        CASE
          WHEN pr.expires_at IS NULL THEN NULL
          ELSE DATEDIFF(pr.expires_at, CURDATE())
        END AS days_left
       FROM print_requests pr
       JOIN residents r ON r.id = pr.resident_id
       JOIN users u ON u.id = pr.requested_by
       ORDER BY pr.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch print requests error:", err);
    res.status(500).json({ message: "Failed to fetch print requests" });
  }
});

app.post('/api/document-request', verifyToken, async (req, res) => {
  const { resident_id, cert_type, issued_at, valid_until } = req.body;

  try {
    if (!resident_id || !cert_type || !issued_at || !valid_until) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const sql = `INSERT INTO document_requested (resident_id, document_types, issued_at, valid_until) VALUES (?, ?, ?, ?)`;

    await pool.query(sql, [resident_id, cert_type, issued_at, valid_until]);
    res.json({ message: "Data Inserted Successfully" })
  } catch {
    console.error("Failed to insert document error:", err);
    res.status(500).json({ message: "Failed to insert document requests" });
  }
})

// ===================== CERTIFICATE TEMPLATES =====================

// Get certificate template by code
app.get("/api/certificate-templates/:code", verifyToken, async (req, res) => {
  try {
    const { code } = req.params;

    const [rows] = await pool.query(
      `SELECT template_id, template_code, template_name, body_html
       FROM certificate_templates
       WHERE template_code = ?`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Certificate template not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Get template error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/certificate-templates", verifyToken, async (req, res) => {
  try {
    const { template_code, template_name, body_html } = req.body;

    if (!template_code || !template_name || !body_html) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO certificate_templates
       (template_code, template_name, body_html)
       VALUES (?, ?, ?)`,
      [template_code, template_name, body_html]
    );

    res.status(201).json({
      message: "Certificate template created",
      template_id: result.insertId,
    });
  } catch (err) {
    console.error("Create template error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/api/certificate-templates/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { body_html } = req.body;

  if (typeof body_html !== "string") {
    return res.status(400).json({ message: "Invalid body_html" });
  }

  const [result] = await pool.query(
    `UPDATE certificate_templates
     SET body_html = ?, updated_at = NOW()
     WHERE template_id = ?`,
    [body_html, id]
  );

  res.json({ affectedRows: result.affectedRows });
});


// ===================== PRINT REQUESTS =====================
app.post("/api/print-requests", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "User") {
      return res.status(403).json({ message: "Only User can request printing" });
    }

    const { resident_id, request_type } = req.body;

    if (!resident_id || typeof request_type !== "string") {
      return res.status(400).json({
        message: "resident_id and valid request_type are required"
      });
    }

    const existing = await query(
      `SELECT id FROM print_requests
       WHERE resident_id = ?
         AND request_type = ?
         AND status IN ('pending','approved')
         AND (expires_at IS NULL OR expires_at > NOW())`,
      [resident_id, request_type]
    );

    if (existing.length) {
      return res.status(409).json({
        message: "There is already an active request for this certificate"
      });
    }

    await query(
      `INSERT INTO print_requests
       (resident_id, request_type, requested_by, status, created_at)
       VALUES (?, ?, ?, 'pending', NOW())`,
      [resident_id, request_type, req.user.id]
    );

    res.json({ message: "Request submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit request" });
  }
});

app.get(
  "/api/print-requests/status/:resident_id/:request_type",
  verifyToken,
  async (req, res) => {
    const { resident_id, request_type } = req.params;

    const [rows] = await pool.query(
      `SELECT status, expires_at,
        CASE
          WHEN expires_at IS NULL THEN NULL
          ELSE DATEDIFF(expires_at, CURDATE())
        END AS days_left
       FROM print_requests
       WHERE resident_id = ?
         AND request_type = ?
         AND status IN ('pending','approved')
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC
       LIMIT 1`,
      [resident_id, request_type]
    );

    if (!rows.length) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      status: rows[0].status,
      expires_at: rows[0].expires_at,
      days_left: rows[0].days_left
    });
  }
);


// ======================= AUDIT LOGS =============================
app.get('/api/audit_logs', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM audit");

    if (rows.length === 0) {
      return res.status(400).json({ message: "No records existed in this page" })
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Error fetching logs" });
  }
});

app.post('/api/audit_my_action', verifyToken, async (req, res) => {
  try {
    const { official_id, username, message, role } = req.body;

    await pool.query('INSERT INTO audit(actor_id, actor_name, message, role) VALUES (?, ?, ?, ?)', [official_id, username, message, role]);

    res.json({ message: "This action was successfully audited" });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
})

app.get('/api/events-display', async (req, res) => {
  try {
    const eventsResult = await query("SELECT id, title, description FROM events");
    const imagesResult = await query("SELECT event_id, image_path FROM event_images");

    res.json({
      events: eventsResult,
      images: imagesResult,
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

app.get("/api/admin/print-requests/pending", verifyToken, async (req, res) => {
  const rows = await query(`
    SELECT pr.id,
           pr.request_type,
           r.first_name,
           r.last_name,
           u.full_name AS requester_name,
           pr.created_at
    FROM print_requests pr
    JOIN residents r ON r.id = pr.resident_id
    JOIN users u ON u.id = pr.requested_by
    WHERE pr.status = 'pending'
    ORDER BY pr.created_at DESC
  `);

  res.json(rows);
});

app.get("/api/households/dashboard", async (req, res) => {
  try {
    const { year } = req.query;

    let sql = `
      SELECT id, household_name, address, purok, created_at
      FROM households
    `;

    const params = [];

    if (year && year !== "all") {
      sql += " WHERE YEAR(created_at) = ?";
      params.push(year);
    }

    const rows = await query(sql, params);

    res.json({
      total: rows.length,
      households: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Household dashboard error" });
  }
});


app.get("/api/services/dashboard", async (req, res) => {
  try {
    const { year } = req.query;

    let sql = `
      SELECT id, service_name, service_date, location
      FROM services
    `;

    const params = [];

    if (year && year !== "all") {
      sql += " WHERE YEAR(service_date) = ?";
      params.push(year);
    }

    const rows = await query(sql, params);

    res.json({
      total: rows.length,
      services: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Services dashboard error" });
  }
});


app.post("/api/insert-receipt", verifyToken, async (req, res) => {
  try {
    const { resident_id, amount, purpose, date } = req.body;

    await pool.query(
      "INSERT INTO receipt (receipt_from, amount, purpose, date) VALUES (?, ?, ?, ?)",
      [resident_id, amount, purpose, date]
    );

    res.json({ message: "The receipt was successfully inserted" });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

function getDateRange(month, year) {
  let startDate, endDate;

  if (month === "all") {
    // YEARLY REPORT
    startDate = `${year}-01-01`;
    endDate = `${year}-12-31`;
  } else {
    // MONTHLY REPORT
    const lastDay = new Date(year, month, 0).getDate();
    startDate = `${year}-${month}-01`;
    endDate = `${year}-${month}-${lastDay}`;
  }

  return { startDate, endDate };
}

app.post("/api/get-data-receipt", verifyToken, async (req, res) => {
  try {
    let { month = "all", year } = req.body;

    // ✅ Validate year
    const parsedYear = Number(year);
    if (!parsedYear) {
      return res.status(400).json({ message: "Year is required" });
    }

    const currentYear = new Date().getFullYear();
    if (parsedYear > currentYear) {
      return res.status(400).json({ message: "Future years are not allowed" });
    }

    // ✅ Validate month
    const validMonths = ["all", ...Array.from({ length: 12 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    )];

    if (!validMonths.includes(month)) {
      return res.status(400).json({ message: "Invalid month value" });
    }

    // ✅ Compute date range
    const { startDate, endDate } = getDateRange(month, parsedYear);

    // ✅ Query
    const [rows] = await pool.query(
      `
      SELECT 
        rs.first_name,
        rs.last_name,
        r.purpose,
        r.amount,
        r.date,
        r.id AS receipt_id
      FROM receipt r
      JOIN residents rs ON r.receipt_from = rs.id
      WHERE r.date BETWEEN ? AND ?
      ORDER BY r.date ASC
      `,
      [startDate, endDate]
    );

    res.json({
      month,
      year: parsedYear,
      startDate,
      endDate,
      total_records: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching receipt data:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

app.get("/api/receipts", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT r.id AS receipt_id, rs.first_name, rs.last_name, r.purpose, r.amount, r.date FROM receipt r JOIN residents rs ON r.receipt_from = rs.id ORDER BY r.date ASC"
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "No records existed in this page" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});



const PORT = process.env.WEB_PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://192.168.50.56:${PORT}`);
});