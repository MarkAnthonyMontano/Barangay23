import React, { useEffect, useState, useContext } from 'react';
import { SettingsContext } from "../App";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../api';
import API_BASE_URL from '../ApiConfig';

const POSITIONS = [
  'Punong Barangay',
  'Barangay Kagawad',
  'Sangguniang Kabataan Chairperson',
  'Barangay Secretary',
  'Barangay Treasurer',
  'Barangay Clerk',
];

const API_ROOT = `${API_BASE_URL}`; // for signature images

const PAGE_ACCESS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'residents', label: 'Residents' },
  { key: 'households', label: 'Households' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'services', label: 'Services' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'officials', label: 'Officials' },
  { key: 'calendarpage', label: 'Events Calendar' },
  { key: 'settings', label: 'Barangay Profile' },
  { key: 'requestpanel', label: 'Request Panel' },
  { key: 'auditpage', label: 'History Logs' },
  { key: 'adminsecuritysettings', label: 'Settings' },
  { key: 'residentidcard', label: 'Resident ID Card' },
];

const ROLE_DEFAULT_ACCESS = {
  superadmin: PAGE_ACCESS.map((p) => p.key), // ALL pages

  admin: PAGE_ACCESS
    .filter((p) => !['settings', 'calendarpage', 'auditpage'].includes(p.key))
    .map((p) => p.key),

  user: PAGE_ACCESS
    .filter((p) => !['officials', 'settings', 'calendarpage', 'auditpage', 'requestpanel'].includes(p.key))
    .map((p) => p.key),
};

const emptyForm = {
  id: null,
  full_name: '',
  position: 'Punong Barangay',
  order_no: 0,
  is_captain: false,
  is_secretary: false,
};

const emptyAccessForm = {
  official_id: '',
  full_name: '',
  username: '',
  password: '',
  confirm_password: '',
  role: 'user',
  require_otp: 0,
  page_access: [],
};

const OfficialsPage = () => {
  const { settings } = useContext(SettingsContext);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [signatureFile, setSignatureFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [accessForm, setAccessForm] = useState(emptyAccessForm);
  const [accessError, setAccessError] = useState('');
  const [savingAccess, setSavingAccess] = useState(false);

  const [editAccessOpen, setEditAccessOpen] = useState(false);
  const [editAccessForm, setEditAccessForm] = useState({
    user_id: null,
    official_id: '',
    full_name: '',
    username: '',
    role: 'User',
    require_otp: 0,
    page_access: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [myRole, setMyRole] = useState("");
  const [myData, setMyData] = useState(null);
  const [myAction, setMyAction] = useState("");

  useEffect(() => {
    const fetchMyRole = async () => {
      try {
        const res = await api.get("/auth/me");
        setMyRole(res.data.role);
        setMyData(res.data);

      } catch (err) {
        console.error(err);
        showSnackbar("Failed to get my role", "error");
      }
    };

    fetchMyRole();
  }, []);

  const AuditMyAction = async (actionMessage) => {
    if (!myData) return;

    try {
      const actor_name = `${myData.full_name} (${myData.username})`;
      const actor_message = `User ${actor_name} ${actionMessage}`;

      await api.post("/audit_my_action", {
        official_id: myData.official_id,
        username: actor_name,
        message: actor_message,
        role: myRole,
      });

    } catch (err) {
      console.error(err);
      showSnackbar("Failed to audit this action", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(null);
    }
  };

  const loadOfficials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/officials');
      setOfficials(res.data || []);
    } catch (err) {
      console.error('Error loading officials', err);
      alert('Error loading officials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficials();
  }, []);

  useEffect(() => {
    if (!accessDialogOpen) return;

    setAccessForm(prev => ({
      ...prev,
      page_access: ROLE_DEFAULT_ACCESS[prev.role] || [],
    }));
  }, [accessForm.role, accessDialogOpen]);

  const openAddDialog = () => {
    setForm({
      ...emptyForm,
    });
    setSignatureFile(null);
    setError('');
    setDialogOpen(true);
  };

  const openGrantAccessDialog = () => {
    setAccessForm(emptyAccessForm);
    setAccessError('');
    setAccessDialogOpen(true);
  };

  const openEditDialog = (off) => {
    setForm({
      id: off.id,
      full_name: off.full_name,
      position: off.position,
      order_no: off.order_no ?? 0,
      is_captain: !!off.is_captain,
      is_secretary: !!off.is_secretary,
    });

    setSignatureFile(null);
    setProfileFile(null);

    // Load preview if exists
    if (off.profile_img) {
      setProfilePreview(`${API_ROOT}${off.profile_img}`);
    } else {
      setProfilePreview(null);
    }

    setError('');
    setDialogOpen(true);
  };

  const openEditAccessDialog = async (official) => {
    try {
      const res = await api.get(`/user-by-official/${official.id}`);

      setEditAccessForm({
        user_id: res.data.id,
        official_id: official.id,
        full_name: res.data.full_name,
        username: res.data.username,
        role: res.data.role,
        require_otp: res.data.require_otp,
        page_access: res.data.page_access || [],
      });

      setEditAccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load user access");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAccessChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'official_id') {
      const off = officials.find((o) => String(o.id) === String(value));
      setAccessForm((prev) => ({
        ...prev,
        official_id: value,
        full_name: off ? off.full_name : '',
      }));
      return;
    }

    if (type === 'checkbox') {
      setAccessForm((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
      return;
    }

    if (name === 'role') {
      setAccessForm((prev) => ({
        ...prev,
        role: value,
        page_access: ROLE_DEFAULT_ACCESS[value] || [],
      }));
      return;
    }

    setAccessForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      position: value,
      is_captain: value === 'Punong Barangay' ? true : prev.is_captain,
      is_secretary:
        value === 'Barangay Secretary' ? true : prev.is_secretary,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSignatureFile(file);
  };

  const validateForm = () => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.position.trim()) return 'Position is required.';
    return '';
  };

  const validateAccessForm = () => {
    if (!accessForm.official_id) return 'Official is required';
    if (!accessForm.username) return 'Username is required';
    if (!accessForm.password) return 'Password is required';
    if (accessForm.password !== accessForm.confirm_password)
      return 'Passwords do not match';
    if (accessForm.page_access.length === 0)
      return 'Select at least one page';
    return '';
  };

  const handleSave = async () => {
    const msg = validateForm();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append('full_name', form.full_name);
      fd.append('position', form.position);
      fd.append('order_no', form.order_no || 0);
      fd.append('is_captain', form.is_captain ? '1' : '0');
      fd.append('is_secretary', form.is_secretary ? '1' : '0');

      if (signatureFile) {
        fd.append('signature', signatureFile);
      }
      if (profileFile) {
        fd.append('profile_img', profileFile);
      }

      if (form.id) {
        await api.put(`/officials/${form.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await AuditMyAction(`Updated the record of ${form.full_name} in Official Page`);
      } else {
        await api.post('/officials', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await AuditMyAction(`Added a new record ${form.full_name} in Official Page`);
      }

      setDialogOpen(false);
      await loadOfficials();
    } catch (err) {
      console.error('Error saving official', err);
      setError(err.response?.data?.message || 'Error saving official');
    } finally {
      setSaving(false);
    }
  };

  const handleGrantAccess = async () => {
    const msg = validateAccessForm();
    if (msg) {
      setAccessError(msg);
      return;
    }

    try {
      setSavingAccess(true);

      await api.post('/auth/register', {
        official_id: accessForm.official_id,
        username: accessForm.username,
        password: accessForm.password,
        full_name: accessForm.full_name,
        role: accessForm.role,
        require_otp: accessForm.require_otp,
        page_access: accessForm.page_access,
      });
      await AuditMyAction(`Grant User ${accessForm.full_name} an access to ${accessForm.page_access} in Official Page`);
      setAccessDialogOpen(false);
      showSnackbar(`Access successfully granted ${accessForm.role} privilege to ${accessForm.full_name}`, "success")
    } catch (err) {
      console.error('Error creating user', err);
      setAccessError(err.response?.data?.message || 'Error creating account');

    } finally {
      setSavingAccess(false);
    }
  };

  const handleUpdateAccess = async () => {
    try {
      await api.put(`/update-access/${editAccessForm.user_id}`, {
        role: editAccessForm.role,
        require_otp: editAccessForm.require_otp,
        page_access: editAccessForm.page_access,
      });

      await AuditMyAction(`Updated access of ${editAccessForm.full_name} in Officials Page`);
      setEditAccessOpen(false);
      showSnackbar("Access updated successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update access", "error");
    }
  };

  const handleDeleteClick = (off) => {
    setToDelete(off);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/officials/${toDelete.id}`);
      await AuditMyAction(`Deleted the record of ${toDelete.full_name} in Official Page`);
      setDeleteOpen(false);
      setToDelete(null);
      await loadOfficials();
    } catch (err) {
      console.error('Error deleting official', err);
      alert(err.response?.data?.message || 'Error deleting official');
    } finally {
      setDeleting(false);
    }
  };

  const bodyCellStyle = {
    color: "black",
    textAlign: "center",
    fontSize: "12px",
    py: 0.5,
    borderRight: "2px solid black",
    borderBottom: "2px solid black",
  };


  // 🔒 Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 🔒 Block DevTools shortcuts + Ctrl+P silently
  document.addEventListener('keydown', (e) => {
    const isBlockedKey =
      e.key === 'F12' || // DevTools
      e.key === 'F11' || // Fullscreen
      (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
      (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
      (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

    if (isBlockedKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  });


  return (
    <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "times new roman", fontSize: "36px" }}>
          BARANGAY OFFICIALS
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* TITLE HEADER */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          border: "1px solid #ddd",
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: settings?.header_color || "#1976d2",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  border: "3px solid black"
                }}
              >
                Barangay Officials
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {loading ? (
        <Typography>Loading officials...</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            mt: -.5,
            border: "2px solid black",
          }}
        >
          {/* BUTTON SPACE (UX PRESERVED, SPACE CONTROLLED) */}
          <Box
            sx={{
              px: 2,
              mt: 2,

              borderBottom: "2px solid black",
            }}
          >
            {/* Label */}

            {/* Buttons container */}
            <Box
              sx={{
                height: 65, // space only for buttons
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={openAddDialog}
                sx={{

                  px: 2.5,
                  mb: 2,
                  py: 1,
                  height: "55px",
                  width: "223px",
                }}
              >
                Add Official
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#9E0000",
                  width: "223px",
                  height: "55px",
                  ml: 1,
                  mb: 2,
                }}
                onClick={openGrantAccessDialog}
              >
                Grant Access
              </Button>
            </Box>
          </Box>


          {/* TABLE */}
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "gray",
                }}
              >
                {[
                  "Order",
                  "Profile",
                  "Full Name",
                  "Position",
                  "Captain",
                  "Secretary",
                  "Signature",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "white",
                      height: "50px",
                      textAlign: "center",
                      width: "15%",
                      py: 0.5,
                      fontSize: "12px",
                      border: "2px solid black",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {officials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 3,
                      borderBottom: "2px solid black",
                      borderRight: "2px solid black",
                      borderLeft: "2px solid black",
                    }}
                  >
                    No officials encoded yet.
                  </TableCell>
                </TableRow>
              ) : (
                officials.map((o, index) => (
                  <TableRow
                    key={o.id}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      transition: "0.2s",
                    }}
                  >
                    {/* Order (FIRST COLUMN → add LEFT border) */}
                    <TableCell
                      sx={{
                        ...bodyCellStyle,
                        borderLeft: "2px solid black",
                      }}
                    >
                      {o.order_no}
                    </TableCell>

                    {/* Profile */}
                    <TableCell sx={bodyCellStyle}>
                      {o.profile_img ? (
                        <img
                          src={`${API_ROOT}${o.profile_img}`}
                          alt="Profile"
                          style={{
                            height: 45,
                            width: 45,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #ddd",
                          }}
                        />
                      ) : (
                        <Typography variant="caption">None</Typography>
                      )}
                    </TableCell>

                    <TableCell sx={bodyCellStyle}>{o.full_name}</TableCell>
                    <TableCell sx={bodyCellStyle}>{o.position}</TableCell>
                    <TableCell sx={bodyCellStyle}>{o.is_captain ? "Yes" : ""}</TableCell>
                    <TableCell sx={bodyCellStyle}>{o.is_secretary ? "Yes" : ""}</TableCell>

                    {/* Signature */}
                    <TableCell sx={bodyCellStyle}>
                      {o.signature_path ? (
                        <img
                          src={`${API_ROOT}${o.signature_path}`}
                          alt="Signature"
                          style={{
                            height: 40,
                            maxWidth: 120,
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography variant="caption">None</Typography>
                      )}
                    </TableCell>

                    {/* Actions (LAST COLUMN → still OK) */}
                    <TableCell sx={bodyCellStyle}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "green",
                            color: "white",
                            width: "80px",
                          }}
                          onClick={() => openEditDialog(o)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#9E0000",
                            color: "white",
                            width: "80px",
                          }}
                          onClick={() => handleDeleteClick(o)}
                        >
                          Delete
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          disabled={!o.has_account}
                          sx={{
                            width: "180px",
                            backgroundColor: o.has_account ? "#1976d2" : "#9e9e9e",
                            color: "white",
                          }}
                          onClick={() => o.has_account && openEditAccessDialog(o)}
                        >
                          {o.has_account ? "Edit Access" : "Create Account"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {form.id ? "Edit Official" : "Add Official"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>

            {/* Profile Upload */}
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth component="label" sx={{ borderRadius: 2 }}>
                {profileFile ? "Change Profile Picture" : "Upload Profile Picture"}
                <input type="file" hidden accept="image/*" onChange={handleProfileChange} />
              </Button>

              {profilePreview && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    style={{
                      height: 90,
                      width: 90,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ccc",
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Position"
                name="position"
                value={form.position}
                onChange={handlePositionChange}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                {POSITIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Order No."
                name="order_no"
                type="number"
                value={form.order_no}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Signature Upload */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" sx={{ borderRadius: 2 }}>
                {signatureFile ? "Change Signature" : "Upload Signature"}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>

              {signatureFile && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {signatureFile.name}
                </Typography>
              )}
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Official</DialogTitle>

        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{toDelete ? toDelete.full_name : "this official"}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleDeleteConfirm}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={accessDialogOpen}
        onClose={() => setAccessDialogOpen(false)}
        maxWidth="sm"
        fullWidth

      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          Grant System Access
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1, }}>

            {/* Select Official */}
            <Grid item xs={12}>
              <TextField
                select
                label="Select Official"
                name="official_id"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.official_id}
                onChange={handleAccessChange}
                fullWidth
                required
              >
                {officials.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.full_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Full Name */}
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="full_name"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.full_name}
                onChange={handleAccessChange}
                fullWidth
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.username}
                onChange={handleAccessChange}
                fullWidth
                required
              />
            </Grid>

            {/* Passwords */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.password}
                onChange={handleAccessChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.confirm_password}
                onChange={handleAccessChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(p => !p)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                name="role"
                sx={{ width: "223px", height: "55px" }}
                value={accessForm.role}
                onChange={handleAccessChange}
                fullWidth
              >
                <MenuItem value="superadmin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </Grid>

            {/* Require OTP */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Is OTP required?
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accessForm.require_otp === 1}
                      onChange={() => setAccessForm(p => ({ ...p, require_otp: 1 }))}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accessForm.require_otp === 0}
                      onChange={() => setAccessForm(p => ({ ...p, require_otp: 0 }))}
                    />
                  }
                  label="No"
                />
              </Box>
            </Grid>

            {/* Page Access */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Page Access
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }}>
                {PAGE_ACCESS.map(p => (
                  <FormControlLabel
                    key={p.key}
                    control={
                      <Checkbox
                        checked={accessForm.page_access.includes(p.key)}
                        onChange={() => {
                          setAccessForm(prev => ({
                            ...prev,
                            page_access: prev.page_access.includes(p.key)
                              ? prev.page_access.filter(k => k !== p.key)
                              : [...prev.page_access, p.key],
                          }));
                        }}
                      />
                    }
                    label={p.label}
                  />
                ))}
              </Box>
            </Grid>

            {/* Error */}
            {accessError && (
              <Grid item xs={12}>
                <Typography color="error">{accessError}</Typography>
              </Grid>
            )}

          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={() => setAccessDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGrantAccess}
            disabled={savingAccess}
          >
            {savingAccess ? 'Saving...' : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editAccessOpen} onClose={() => setEditAccessOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
          Edit System Access
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={12}>
              <TextField
                label="Full Name"
                value={editAccessForm.full_name}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Username"
                value={editAccessForm.username}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                sx={{ width: "150px" }}
                value={editAccessForm.role}
                onChange={(e) =>
                  setEditAccessForm(p => ({
                    ...p,
                    role: e.target.value,
                    page_access: ROLE_DEFAULT_ACCESS[e.target.value] || [],
                  }))
                }
                fullWidth
              >
                <MenuItem value="SuperAdmin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">Page Access</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {PAGE_ACCESS.map(p => (
                  <FormControlLabel
                    key={p.key}
                    control={
                      <Checkbox
                        checked={editAccessForm.page_access.includes(p.key)}
                        onChange={() =>
                          setEditAccessForm(prev => ({
                            ...prev,
                            page_access: prev.page_access.includes(p.key)
                              ? prev.page_access.filter(k => k !== p.key)
                              : [...prev.page_access, p.key],
                          }))
                        }
                      />
                    }
                    label={p.label}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editAccessForm.require_otp === 1}
                    onChange={(e) =>
                      setEditAccessForm(p => ({
                        ...p,
                        require_otp: e.target.checked ? 1 : 0,
                      }))
                    }
                  />
                }
                label="Require OTP"
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditAccessOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateAccess}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default OfficialsPage;
