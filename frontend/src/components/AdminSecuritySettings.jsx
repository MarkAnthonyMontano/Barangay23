import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  TextField,
  Grid,
  InputLabel,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import api from "../api";
import API_BASE_URL from "../ApiConfig";

const passwordRules = [
  { label: "Minimum of 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one lowercase letter (e.g. abc)", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one uppercase letter (e.g. ABC)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one number (e.g. 123)", test: (pw) => /\d/.test(pw) },
  { label: "At least one special character (! # $ ^ * @)", test: (pw) => /[!#$^*@]/.test(pw) },
];


export default function AdminSecuritySettings() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ===============================
  // Load profile
  // ===============================
  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data);
      setFullName(res.data.full_name || "");
      setOtpRequired(Number(res.data.require_otp) === 1);
    } catch (err) {
      console.error("Auth error:", err.response?.status);

      // 🔐 Token expired or invalid
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };


  useEffect(() => {
    if (localStorage.getItem("token")) loadProfile();
  }, []);

  const syncSidebarUser = async () => {
    const me = await api.get("/auth/me");
    localStorage.setItem("user", JSON.stringify(me.data));
  };

  // ===============================
  // Save Full Name
  // ===============================
  const handleSaveFullName = async () => {
    try {
      await api.put("/user/profile", { full_name: fullName });
      await loadProfile();
      await syncSidebarUser();

      setSnack({
        open: true,
        message: "Full name updated successfully",
        severity: "success",
      });
    } catch {
      setSnack({
        open: true,
        message: "Failed to update full name",
        severity: "error",
      });
    }
  };

  // ===============================
  // Profile Image
  // ===============================
  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const fd = new FormData();
      fd.append("profile_img", imageFile); // ✅ MUST MATCH MULTER

      await api.put("/user/profile-image", fd); // ✅ PUT

      await loadProfile();
      await syncSidebarUser();

      setSnack({
        open: true,
        message: "Profile image updated",
        severity: "success",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      setSnack({
        open: true,
        message: err.response?.data?.message || "Failed to upload image",
        severity: "error",
      });
    }
  };

  // ===============================
  // Password
  // ===============================
  const validations = passwordRules.map((r) => r.test(newPassword));
  const isPasswordValid =
    validations.every(Boolean) &&
    newPassword === confirmPassword &&
    currentPassword;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put("/user/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSnack({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message:
          err.response?.data?.message || "Password update failed",
        severity: "error",
      });
    }
  };

  // ===============================
  // OTP SAVE
  // ===============================
  const handleSaveOtp = async () => {
    try {
      await api.put("/user/security-settings", {
        require_otp: otpRequired,
      });

      setSnack({
        open: true,
        message: "OTP setting updated",
        severity: "success",
      });
    } catch {
      setSnack({
        open: true,
        message: "Failed to update OTP",
        severity: "error",
      });
    }
  };

  const toggleShow = (key) =>
    setShowPassword((p) => ({ ...p, [key]: !p[key] }));

  if (!profile) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography>Loading profile…</Typography>
      </Box>
    );
  }

  // // 🔒 Disable right-click
  // document.addEventListener('contextmenu', (e) => e.preventDefault());

  // // 🔒 Block DevTools shortcuts + Ctrl+P silently
  // document.addEventListener('keydown', (e) => {
  //   const isBlockedKey =
  //     e.key === 'F12' || // DevTools
  //     e.key === 'F11' || // Fullscreen
  //     (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
  //     (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
  //     (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

  //   if (isBlockedKey) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // });


  return (
    <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "times new roman", fontSize: "36px" }}>
          SECURITY SETTINGS
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />
      {/* CONTENT AREA CENTER */}
      <Box sx={{ mx: "auto", mt: 10 }}>
        <Grid container spacing={4}>

          {/* LEFT */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: 650,
                width: 700,
                borderRadius: 3,
                ml: 15,
                border: "2px solid #000",
              }}
            >
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
                Admin Security Settings
              </Typography>

              <Box textAlign="center" mb={4}>
                <Avatar
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : profile.profile_image
                        ? `${API_BASE_URL}${profile.profile_image}`
                        : ""
                  }
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />

                {/* Hidden file input */}
                <input
                  accept="image/*"
                  type="file"
                  id="profile-image-upload"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />

                <label htmlFor="profile-image-upload">
                  <Button variant="outlined" component="span" sx={{ mr: 1 }}>
                    Choose Photo
                  </Button>
                </label>

                <Button
                  variant="contained"
                  onClick={handleImageUpload}
                  disabled={!imageFile}
                >
                  Upload Photo
                </Button>
              </Box>


              <Typography fontWeight="bold" mb={1}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Button
                fullWidth
                sx={{ mt: 1, mb: 3 }}
                variant="contained"
                onClick={handleSaveFullName}
              >
                Save Full Name
              </Button>

              <Alert severity="warning" sx={{ mb: 1 }}>
                Turning this off may compromise your account.
              </Alert>

              <FormControlLabel
                control={
                  <Switch
                    checked={otpRequired}
                    onChange={(e) => setOtpRequired(e.target.checked)}
                  />
                }
                label="Require OTP during login"
              />

              <Button
                fullWidth
                sx={{ mt: 1 }}
                variant="contained"
                onClick={handleSaveOtp}
              >
                Save Settings
              </Button>
            </Paper>
          </Grid>

          {/* RIGHT */}
          <Grid item xs={10} md={5}>
            <Paper
              sx={{
                p: 4,
                height: 650,
                width: 700,
                borderRadius: 3,
                border: "2px solid #000",
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Change Password
              </Typography>

              <form onSubmit={handlePasswordUpdate}>
                {[
                  ["Current Password", currentPassword, setCurrentPassword, "current"],
                  ["New Password", newPassword, setNewPassword, "new"],
                  ["Confirm Password", confirmPassword, setConfirmPassword, "confirm"],
                ].map(([label, value, setter, key]) => (
                  <TextField
                    key={key}
                    fullWidth
                    sx={{ mb: 2 }}
                    type={showPassword[key] ? "text" : "password"}
                    label={label}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleShow(key)}>
                            {showPassword[key] ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

                <List dense>
                  {passwordRules.map((rule, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        {validations[i] ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={rule.label} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isPasswordValid}
                >
                  Update Password
                </Button>
              </form>
            </Paper>
          </Grid>

        </Grid>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() =>
            setSnack((prev) => ({ ...prev, open: false }))
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // 👈 TOP CENTER
        >
          <Alert
            onClose={() =>
              setSnack((prev) => ({ ...prev, open: false }))
            }
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>

      </Box>
    </Box>
  );

}
