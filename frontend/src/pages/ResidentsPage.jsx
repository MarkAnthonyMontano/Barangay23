// src/pages/ResidentsPage.jsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../App";
import axios from "axios";

import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  Card,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
import api from '../api';
import ResidentIDCard from "../pages/ResidentIDCard";
import BagongPilipinas from "../assets/BagongPilipinas.png";
import Barangay369 from "../assets/Barangay369.jpg";
import LungsodngManila from "../assets/LungsodngManila.jpg";
import API_BASE_URL from '../ApiConfig';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { QRCodeCanvas } from "qrcode.react";


const initialForm = {
  last_name: '',
  first_name: '',
  middle_name: '',
  suffix: '',
  sex: 'Male',
  age: '',
  email_address: '',
  is_senior: 0,
  birthdate: '',
  civil_status: '',
  work: '',
  monthly_income: '',
  contact_no: '',
  purok: '',
  address: '',
  is_voters: 0,
  precint_no: '',
  fullname_emergency: '',
  contact_no_emergency: '',
  is_pwd: 0,
  is_solo_parent: 0,
  living: '',
};

const API_ROOT = `${API_BASE_URL}`;

const ResidentsPage = () => {
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [sexFilter, setSexFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('');
  const [civilStatusFilter, setCivilStatusFilter] = useState('');
  const [purokFilter, setPurokFilter] = useState('');
  const [voterFilter, setVoterFilter] = useState('All');
  const [precinctFilter, setPrecinctFilter] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUpdatePreview, setUpdateImagePreview] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 100; // change if you want
  const [printStatus, setPrintStatus] = useState({});

  const [checking, setChecking] = useState({});

  const [requestStatus, setRequestStatus] = useState({});

  const [openQR, setOpenQR] = useState(false); // modal open/close
  const [selectedResident, setSelectedResident] = useState(null); // resident for QR
  const [seniorManuallyChanged, setSeniorManuallyChanged] = useState(false);

  const handleOpenQR = (resident) => {
    setSelectedResident(resident);
    setOpenQR(true);
  };

  const handleCloseQR = () => {
    setSelectedResident(null);
    setOpenQR(false);
  };

  const baseUrl = window.location.origin;

  const sendPrintRequest = async (residentId) => {
    try {
      await api.post("/print-requests", {
        resident_id: residentId,
        request_type: "barangay_id", // ✅ FIXED
      });

      showSnackbar("Barangay ID print request sent!", "success");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to send request",
        "error"
      );
    }
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    resident_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    address: "",
    birthdate: "",
    precinct_no: "",
    id_no: "",
    date_issued: "",
    valid_until: "",
    status: 1,
  });

  const printRef = useRef(null);
  const [printEmptyForm, setPrintEmptyForm] = useState(false);

  useEffect(() => {
    const afterPrint = () => {
      setPrintEmptyForm(false);
    };

    window.addEventListener("afterprint", afterPrint);
    return () => window.removeEventListener("afterprint", afterPrint);
  }, []);


  const handlePrintID = async () => {
    await AuditMyAction("Print the barangay id of a resident in Residents Page");
    window.print();
  };

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/residents');
      setResidents(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Error fetching residents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (key !== "profile_img") data.append(key, form[key]);
      });

      if (form.profile_img) {
        data.append("profile_img", form.profile_img);
      }

      await api.post("/residents", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSnackbar("Resident added successfully!", "success"); // ✅ ADD THIS

      setForm(initialForm);
      setSeniorManuallyChanged(false);
      await AuditMyAction("Added a new resident record in Resident Page");
      fetchResidents();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Error saving resident", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleNotifyClaim = async (residentId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `/api/residents/${residentId}/notify-id-claim`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("📧 Resident has been notified successfully!", "success");

      await AuditMyAction("Notified a resident to claim barangay ID");

    } catch (err) {
      console.error(err);

      showSnackbar(
        err.response?.data?.message || "Failed to notify resident",
        "error"
      );
    }
  };



  const handleEditClick = (resident) => {
    setEditData({ ...resident });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => {
      if (name === "birthdate") {
        return {
          ...prev,
          birthdate: value,
          age: calculateAge(value),
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleEditSave = async () => {
    try {
      setUpdating(true);
      const data = new FormData();

      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "profile_img") {
          data.append(key, value ?? "");
        }
      });

      if (editData.profile_img) {
        data.append("profile_img", editData.profile_img);
      }

      await api.put(`/residents/${editData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSnackbar("Resident updated successfully!", "success"); // ✅ ADD THIS


      await AuditMyAction("Updated resident record in Residents Page");
      setEditOpen(false);
      setEditData(null);
      fetchResidents();
    } catch (err) {
      console.error(err);
      showSnackbar(
        err.response?.data?.message || "Error updating resident",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData(null);
  };

  const incomeLabel = (val) => {
    switch (Number(val)) {
      case 0: return "Less than 5000";
      case 1: return "5000 to 10000";
      case 2: return "10000 to 20000";
      case 3: return "20000 to 30000";
      case 4: return "30000 to 40000";
      case 5: return "40000 to 50000";
      case 6: return "More than 50000";
      default: return "";
    }
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState(null);

  const handleOpenDelete = (id) => {
    setSelectedResidentId(id);
    setOpenDelete(true);
  };
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      await axios.delete(`/api/residents/${selectedResidentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar("Resident deleted successfully.", "success");

      setOpenDelete(false);
      setSelectedResidentId(null);
      fetchResidents();

    } catch (err) {
      console.error(err);
      showSnackbar(
        err.response?.data?.message || "Failed to delete resident.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };


  const handleExportResidentsPDF = () => {
    if (filteredResidents.length === 0) {
      showSnackbar("No residents to export", "warning");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.text("Residents Master List", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    });

    const body = filteredResidents.map((r, i) => [
      i + 1,
      `${r.last_name}, ${r.first_name} ${r.middle_name || ""} ${r.suffix || ""}`,
      r.sex,
      r.age,
      r.birthdate,
      r.civil_status,
      r.work,
      incomeLabel(r.monthly_income),
      r.contact_no,
      r.purok,
      r.address,
      Number(r.is_voters) === 1 ? "Yes" : "No",
      r.precint_no,
      r.fullname_emergency,
      r.contact_no_emergency,
      Number(r.status) === 1 ? "Alive" : "Deceased",
      Number(r.is_pwd) === 1 ? "Yes" : "No",
      Number(r.is_solo_parent) === 1 ? "Yes" : "No",
      r.living || "",                         // ✅ Living
    ]);

    autoTable(doc, {
      startY: 22,
      head: [[
        "#",
        "Full Name",
        "Sex",
        "Age",
        "Birthdate",
        "Civil Status",
        "Work",
        "Monthly Income",
        "Contact",
        "Purok",
        "Address",
        "Voter",
        "Precinct",
        "Emergency Name",
        "Emergency Contact",
        "Status",
        "PWD",        // ✅ NEW COLUMN
        "Solo Parent",        // ✅ NEW COLUMN
        "Living",     // ✅ NEW COLUMN
      ]],
      body,
      styles: {
        fontSize: 7,
        halign: "center",
        valign: "middle",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
    });

    doc.save("residents_list.pdf");
  };

  const handleExportResidentsExcel = () => {
    if (filteredResidents.length === 0) {
      showSnackbar("No residents to export", "warning");
      return;
    }

    const data = filteredResidents.map((r, i) => ({
      "#": i + 1,
      "Full Name": `${r.last_name}, ${r.first_name} ${r.middle_name || ""} ${r.suffix || ""}`,
      Sex: r.sex,
      Age: r.age,
      Birthdate: r.birthdate,
      "Civil Status": r.civil_status,
      Work: r.work,
      "Monthly Income": incomeLabel(r.monthly_income),
      Contact: r.contact_no,
      Purok: r.purok,
      Address: r.address,
      Voter: Number(r.is_voters) === 1 ? "Yes" : "No",
      "Precinct No": r.precint_no,
      "Emergency Name": r.fullname_emergency,
      "Emergency Contact": r.contact_no_emergency,
      Status: Number(r.status) === 1 ? "Alive" : "Deceased",
      PWD: Number(r.is_pwd) === 1 ? "Yes" : "No",
      PWD: Number(r.is_solo_parent) === 1 ? "Yes" : "No",
      Living: r.living || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Residents");
    XLSX.writeFile(wb, "residents_list.xlsx");
  };

  const handleImportResidents = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let rows = XLSX.utils.sheet_to_json(sheet);

      // Optional: compute age here if you want
      rows = rows.map(r => ({
        ...r,
        age: calculateAge(r.birthdate),
      }));

      try {
        await api.post("/residents/bulk", rows);   // 👈 NEW ENDPOINT

        showSnackbar("Residents imported successfully!", "success");
        fetchResidents();
      } catch (err) {
        console.error(err);
        showSnackbar("Import failed. Check Excel format.", "error");
      }
    };

    reader.readAsBinaryString(file);
  };

  const filteredResidents = residents.filter((r) => {
    const searchStr = `
    ${r.last_name}
    ${r.first_name}
    ${r.middle_name || ""}
    ${r.address || ""}
  `.toLowerCase();

    const matchSearch = searchStr.includes(search.toLowerCase());
    const matchSex = sexFilter === "All" || r.sex === sexFilter;
    const matchAge = !ageFilter || String(r.age) === ageFilter;
    const matchCivil = !civilStatusFilter || (r.civil_status || "").toLowerCase().includes(civilStatusFilter.toLowerCase());
    const matchPurok = !purokFilter || (r.purok || "").toLowerCase().includes(purokFilter.toLowerCase());
    const matchVoter =
      voterFilter === "All" ||
      (voterFilter === "Yes" && Number(r.is_voters) === 1) ||
      (voterFilter === "No" && Number(r.is_voters) === 0);
    const matchPrecinct =
      !precinctFilter || (r.precint_no || "").toLowerCase().includes(precinctFilter.toLowerCase());

    return (
      matchSearch &&
      matchSex &&
      matchAge &&
      matchCivil &&
      matchPurok &&
      matchVoter &&
      matchPrecinct
    );
  });

  const totalPages = Math.ceil(filteredResidents.length / rowsPerPage);

  const paginatedResidents = filteredResidents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    sexFilter,
    ageFilter,
    civilStatusFilter,
    purokFilter,
    voterFilter,
    precinctFilter,
  ]);

  // Helper: parse "YYYY-MM-DD" safely (local date in Asia/Manila)
  const parseISODate = (dateString) => {
    if (!dateString) return null;
    const [y, m, d] = dateString.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  // Helper: get current date in Asia/Manila (no time portion)
  const getManilaDate = () => {
    const now = new Date();
    const manilaString = now.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [month, day, year] = manilaString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  // Calculate age
  const calculateAge = (birthDateString) => {
    const birthDate = parseISODate(birthDateString);
    if (!birthDate) return "";

    const today = getManilaDate();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age < 0 ? "" : age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "birthdate") {
        const age = calculateAge(value);

        if (age < 60) {
          setSeniorManuallyChanged(false);
        }

        return {
          ...prev,
          birthdate: value,
          age,
          is_senior:
            age < 60
              ? 0
              : !seniorManuallyChanged
                ? 1
                : prev.is_senior,
        };
      }

      if (name === "is_senior") {
        setSeniorManuallyChanged(true);

        return {
          ...prev,
          is_senior: Number(value),
        };
      }

      return { ...prev, [name]: value };
    });
  };


  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    try {
      const payload = {
        resident_id: preview?.id || editData?.id || requestForm.resident_id,
        precinct_no: requestForm.precinct_no,
        id_number: requestForm.id_no,
        date_issue: requestForm.date_issued,
        valid_until: requestForm.valid_until,
      };

      await api.post("/request-id", payload);

      showSnackbar("Request submitted successfully!", "success");
      setRequestOpen(false);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to submit request", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

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

  useEffect(() => {
    if (myRole !== "User") return;

    residents.forEach(async (r) => {
      try {
        const res = await api.get(
          `/print-requests/status/${r.id}/barangay_id`
        );

        setRequestStatus(prev => ({
          ...prev,
          [r.id]: res.data
        }));
      } catch (err) {
        console.error(err);
      }
    });
  }, [residents, myRole]);

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

  const [approvedRequests, setApprovedRequests] = useState({});

  const fetchApprovedPrintRequests = async () => {
    try {
      const res = await api.get("/admin/print-requests/approved");


      const mapped = {};
      res.data.forEach((r) => {
        mapped[r.resident_id] = r;
      });

      setApprovedRequests(mapped);
    } catch (err) {
      console.error("Failed to load approved requests", err);
    }
  };

  useEffect(() => {
    if (myRole === "User") {
      fetchApprovedPrintRequests();
    }
  }, [myRole]);


  useEffect(() => {
    if (myRole !== "User") return;

    residents.forEach(async (r) => {
      try {
        const res = await api.get(`/can-print/${r.id}/barangay_id`);

        setPrintStatus(prev => ({
          ...prev,
          [r.id]: res.data
        }));
      } catch (err) {
        console.error(err);
      }
    });
  }, [residents, myRole]);



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
          RESIDENTS INFORMATION
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />
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
                Residents
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3, mb: 3, mt: -.5, border: "2px solid black" }} elevation={2}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* ===================== ROW 1 ===================== */}
            {/* PROFILE + PERSONAL INFO */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information:
              </Typography>

              <Grid container spacing={2} alignItems="center">
                {/* Profile */}
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    fullWidth
                    disabled={myRole === "User"}
                    sx={{ height: "55px", width: "223px" }}
                  >
                    Upload Photo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setForm((prev) => ({ ...prev, profile_img: file }));
                        setImagePreview(URL.createObjectURL(file));
                      }}
                    />
                  </Button>
                  {imagePreview && (
                    <Box
                      sx={{
                        mt: 1,
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid #ccc",
                        mx: "auto",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField label="Suffix" name="suffix" value={form.suffix} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField sx={{ width: "223px" }} select label="Sex" name="sex" value={form.sex} onChange={handleChange} fullWidth>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    type="date"
                    label="Birthdate"
                    name="birthdate"
                    sx={{ width: "223px" }}
                    value={form.birthdate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField
                    label="Age"
                    name="age"
                    value={form.age}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    placeholder="Email Address"
                    label="Email Address"
                    name="email_address"
                    sx={{ width: "223px" }}
                    value={form.email_address}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    select
                    label="Senior"
                    name="is_senior"
                    value={form.is_senior}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    select
                    label="Civil Status"
                    name="civil_status"
                    sx={{ width: "223px" }}
                    value={form.civil_status}
                    onChange={handleChange}
                    fullWidth
                  >
                    {["Single", "Married", "Divorced", "Widowed", "Separated", "Annulled"].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <TextField
                    select
                    label="PWD"
                    name="is_pwd"
                    value={form.is_pwd}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    select
                    label="Solo Parent"
                    name="is_solo_parent"
                    value={form.is_solo_parent}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField label="Work" name="work" value={form.work} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField sx={{ width: "223px" }} select label="Monthly Income" name="monthly_income" value={form.monthly_income} onChange={handleChange} fullWidth>
                    <MenuItem value="0">Less than 5000</MenuItem>
                    <MenuItem value="1">5000 to 10000</MenuItem>
                    <MenuItem value="2">10000 to 20000</MenuItem>
                    <MenuItem value="3">20000 to 30000</MenuItem>
                    <MenuItem value="4">30000 to 40000</MenuItem>
                    <MenuItem value="5">40000 to 50000</MenuItem>
                    <MenuItem value="6">More than 50000</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* ===================== ROW 2 ===================== */}
            {/* CONTACT + ADDRESS + VOTER */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contact & Address Information:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField label="Contact No." name="contact_no" value={form.contact_no} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Purok" name="purok" value={form.purok} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <TextField
                    select
                    sx={{ width: "223px" }}
                    label="Registered Voter"
                    name="is_voters"
                    value={form.is_voters}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <TextField
                    label="Precinct No."
                    name="precint_no"
                    value={form.precint_no}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Living in Barangay (Years)"
                    name="living"
                    value={form.living}
                    onChange={handleChange}
                    fullWidth
                    placeholder="e.g. 10 years / Since birth"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* ===================== ROW 3 ===================== */}
            {/* EMERGENCY + ACTIONS */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Emergency Contact:
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Full Name"
                    name="fullname_emergency"
                    value={form.fullname_emergency}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Contact No."
                    name="contact_no_emergency"
                    value={form.contact_no_emergency}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end", // ⬅ pushes buttons to the right
                    gap: 2,
                    mt: 2
                  }}
                >
                  <Button
                    sx={{ height: "55px", width: "223px" }}
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving || myRole === "User"}
                  >
                    {saving ? "Saving..." : "Add Resident"}
                  </Button>

                  <Button
                    sx={{ height: "55px", width: "223px" }}
                    variant="contained"
                    color="secondary"
                    onClick={handleExportResidentsPDF}
                  >
                    Export PDF
                  </Button>

                  <Button
                    sx={{ height: "55px", width: "223px" }}
                    variant="contained"
                    color="success"
                    onClick={handleExportResidentsExcel}
                  >
                    Export Excel
                  </Button>

                  <Button
                    sx={{ height: "55px", width: "223px" }}
                    variant="contained"
                    component="label"
                    color="warning"
                  >
                    Import Excel
                    <input
                      hidden
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImportResidents}
                    />
                  </Button>


                  <Button
                    sx={{ height: "55px", width: "260px", ml: 62 }}
                    variant="contained"      // ⬅ blue background
                    color="primary"          // ⬅ normal MUI blue
                    className="hide-on-print"
                    size="large"
                    onClick={() => {
                      setPrintEmptyForm(true);
                      setTimeout(() => window.print(), 100);
                    }}
                  >
                    Print Resident's Form
                  </Button>
                </Grid>

              </Grid>
            </Grid>

          </Grid>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          border: "2px solid black",

        }}
        elevation={2}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">Resident List</Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <TextField
              size="small"
              label="Search (name / address)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sex</InputLabel>
              <Select value={sexFilter} label="Sex" onChange={(e) => setSexFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Age" value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} sx={{ width: 80 }} />
            <TextField
              select
              size="small"
              label="Civil Status"
              value={civilStatusFilter}
              onChange={(e) => setCivilStatusFilter(e.target.value)}
              sx={{ width: "223px" }}
            >
              {["Single", "Married", "Divorced", "Widowed", "Separated", "Annulled"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField size="small" label="Purok" value={purokFilter} onChange={(e) => setPurokFilter(e.target.value)} sx={{ width: 90 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Voter</InputLabel>
              <Select value={voterFilter} label="Voter" onChange={(e) => setVoterFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Precinct" value={precinctFilter} onChange={(e) => setPrecinctFilter(e.target.value)} sx={{ width: 120 }} />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              {/* TABLE HEAD — SAME */}
              <TableHead sx={{ backgroundColor: "gray", color: "white", fontWeight: "bold" }}>
                <TableRow>

                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>ID</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Resident Code</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Picture</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Full Name</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Sex</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Birthdate</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Age</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Email Address</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Senior</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Civil Status</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>PWD</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Solo Parent</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Work</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Monthly Income</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Contact</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Purok</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Address</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Voters</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Precint No</TableCell>

                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2}>Living</TableCell>

                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} colSpan={2} align='center'>Contact In Case of Emergency</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2} align='center'>Status</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} rowSpan={2} align="center">Actions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Full Name</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Contact Number</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Notify Resident</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedResidents.map((r) => (
                  <TableRow
                    key={r.id}
                    sx={{
                      backgroundColor:
                        myRole === "User"
                          ? requestStatus[r.id]?.status === "approved"
                            ? "#d4edda" // ✅ light green
                            : requestStatus[r.id]?.exists
                              ? "#fff3cd" // ⏳ light yellow
                              : "transparent"
                          : "transparent",

                      "&:hover": {
                        backgroundColor:
                          myRole === "User"
                            ? requestStatus[r.id]?.status === "approved"
                              ? "#c3e6cb"
                              : requestStatus[r.id]?.exists
                                ? "#ffe8a1"
                                : "#f5f5f5"
                            : "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.id}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }} align="center">
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleOpenQR(r)}
                      >
                        <QRCodeCanvas
                          value={`${window.location.origin}/?public=residentview&code=${r.resident_code}`}

                          size={60}
                          level="H"

                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                      {r.profile_picture && r.profile_picture.trim() !== "" ? (
                        <img
                          src={
                            r.profile_picture.startsWith("http")
                              ? r.profile_picture
                              : `${API_ROOT}${r.profile_picture.startsWith("/") ? "" : "/"}${r.profile_picture}`
                          }
                          alt="Profile"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "";
                            e.target.style.display = "none";
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                            backgroundColor: "#eee",
                          }}
                        />
                      ) : (
                        <Typography variant="caption">None</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                      {r.last_name}, {r.first_name} {r.middle_name || ''}{' '}
                      {r.suffix || ''}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.sex}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.birthdate || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.age}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.email_address}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{Number(r.is_senior) === 1 ? "Yes" : "No"}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.civil_status || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                      {Number(r.is_pwd) === 1 ? "Yes" : "No"}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                      {Number(r.is_solo_parent) === 1 ? "Yes" : "No"}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.work || ''}</TableCell>
                    <TableCell
                      sx={{ border: "2px solid black", textAlign: "center", color: "black" }}
                    >
                      {r.monthly_income === 0
                        ? "Less than 5000"
                        : r.monthly_income === 1
                          ? "5000 to 10000"
                          : r.monthly_income === 2
                            ? "10000 to 20000"
                            : r.monthly_income === 3
                              ? "20000 to 30000"
                              : r.monthly_income === 4
                                ? "30000 to 40000"
                                : r.monthly_income === 5
                                  ? "40000 to 50000"
                                  : r.monthly_income === 6
                                    ? "More than 50000"
                                    : ""}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.contact_no || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.purok}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.address || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{Number(r.is_voters) === 1 ? "Yes" : "No"}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.precint_no}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }} >
                      {r.living || ""}
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.fullname_emergency || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{r.contact_no_emergency || ''}</TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{Number(r.status) === 1 ? "Alive" : "Deceased"}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: "2px solid black",
                        verticalAlign: "top",
                        px: 1,
                      }}
                    >
                      {/* VIEW BUTTON */}
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ width: 90, mb: 1, fontWeight: "bold", border: "2px solid #000", }}
                        onClick={async () => {
                          // 🔓 ADMIN & SUPERADMIN
                          if (["Admin", "SuperAdmin"].includes(myRole)) {
                            setPreview(r);
                            return;
                          }

                          // 👤 USER
                          const res = await api.get(`/can-print/${r.id}/barangay_id`);

                          if (res.data.allowed) {
                            setPreview(r);
                          } else {
                            showSnackbar("Request is NOT approved yet!", "error");
                          }
                        }}

                      >
                        View ID
                      </Button>

                      {["Admin", "SuperAdmin"].includes(myRole) && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{
                            width: 90,

                            mb: 1,
                            fontWeight: "bold",
                            border: "2px solid #000",
                          }}
                          onClick={() => handleOpenDelete(r.id)}
                        >
                          Delete
                        </Button>
                      )}
                      {/* USER AREA */}
                      {myRole === "User" && (
                        <Box
                          sx={{
                            border: "2px solid #000",
                            borderRadius: 1,
                            p: 1,
                            mb: 1,
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          {/* REQUEST */}
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            fullWidth
                            sx={{ mb: 0.5, fontWeight: "bold" }}
                            disabled={requestStatus[r.id]?.exists}
                            onClick={() => sendPrintRequest(r.id)}
                          >
                            Request
                          </Button>

                          {requestStatus[r.id]?.exists && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: "bold",
                                display: "block",
                                mt: 0.5,
                                color:
                                  requestStatus[r.id].status === "approved"
                                    ? "green"
                                    : "orange",
                              }}
                            >
                              {requestStatus[r.id].status === "approved" ? (
                                <>
                                  ✔ Approved
                                  <br />
                                  Valid until:{" "}
                                  {new Date(requestStatus[r.id].expires_at).toLocaleDateString("en-PH")}
                                  <br />
                                  Days left: {requestStatus[r.id].days_left}
                                </>
                              ) : (
                                "⏳ Pending approval"
                              )}
                            </Typography>
                          )}
                        </Box>
                      )}
                      {/* EDIT */}
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={myRole === "User"}
                        sx={{ width: 90, fontWeight: "bold", border: "2px solid #000", }}
                        onClick={() => handleEditClick(r)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={!r.email_address}
                        onClick={() => handleNotifyClaim(r.id)}
                      >
                        Notify
                      </Button>

                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            px: 2,

            pt: 2,

            height: "70px",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1}
            sx={{ backgroundColor: "gray", width: "100px", border: "2px solid black" }}
            onClick={() => setPage(1)}
          >
            FIRST
          </Button>

          <Button
            variant="contained"
            disabled={page === 1}
            sx={{ backgroundColor: "gray", width: "100px", border: "2px solid black" }}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            PREVIOUS
          </Button>

          <Typography sx={{ mx: 1, fontWeight: "bold" }}>
            Page {page} of {totalPages || 1}
          </Typography>

          <Button
            variant="contained"
            disabled={page === totalPages || totalPages === 0}
            sx={{ backgroundColor: "gray", width: "100px", border: "2px solid black" }}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            NEXT
          </Button>

          <Button
            variant="contained"
            disabled={page === totalPages || totalPages === 0}
            sx={{ backgroundColor: "gray", width: "100px", border: "2px solid black" }}
            onClick={() => setPage(totalPages)}
          >
            LAST
          </Button>
        </Box>
      </Paper>

      {/* ✅ PAGINATION — NOW RELYING ON PAPER */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Resident</DialogTitle>

        <DialogContent dividers>
          {editData && (
            <Grid container spacing={3} sx={{ mt: 1 }}>

              {/* PROFILE IMAGE */}
              <Grid item xs={12} md={4}>
                <Button variant="outlined" component="label" fullWidth>
                  Change Picture
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setEditData((prev) => ({
                        ...prev,
                        profile_img: file,
                      }));
                      setUpdateImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </Button>

                {imageUpdatePreview && (
                  <Box
                    sx={{
                      mt: 2,
                      width: "100%",
                      height: 180,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={imageUpdatePreview}
                      alt="Profile Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>

              {/* PERSONAL INFO */}
              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Last Name" name="last_name" value={editData.last_name} onChange={handleEditChange} fullWidth required />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="First Name" name="first_name" value={editData.first_name} onChange={handleEditChange} fullWidth required />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Middle Name" name="middle_name" value={editData.middle_name || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Suffix" name="suffix" value={editData.suffix || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Sex" name="sex" value={editData.sex} onChange={handleEditChange} fullWidth>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} type="date" label="Birthdate" name="birthdate" value={editData.birthdate || ""} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>

              {/* DEMOGRAPHICS */}
              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Age" value={editData.age || ""} InputProps={{ readOnly: true }} fullWidth />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Email Address"
                  name="email_address"   // ✅ MUST MATCH STATE KEY
                  value={editData.email_address || ""}
                  onChange={handleEditChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Senior" name="is_senior" value={editData.is_senior} onChange={handleEditChange} fullWidth>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  sx={{ width: "223px", height: "55px" }}
                  label="Civil Status"
                  name="civil_status"
                  value={editData.civil_status || ""}
                  onChange={handleEditChange}
                  fullWidth
                >
                  {["Single", "Married", "Divorced", "Widowed", "Separated", "Annulled"].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="PWD" name="is_pwd" value={editData.is_pwd} onChange={handleEditChange} fullWidth>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </TextField>
              </Grid>


              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Solo Parent" name="is_solo_parent" value={editData.is_solo_parent} onChange={handleEditChange} fullWidth>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </TextField>
              </Grid>


              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Work" name="work" value={editData.work || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Monthly Income" name="monthly_income" value={editData.monthly_income || ""} onChange={handleEditChange} fullWidth>
                  <MenuItem value="0">Less than 5,000</MenuItem>
                  <MenuItem value="1">5,000 – 10,000</MenuItem>
                  <MenuItem value="2">10,000 – 20,000</MenuItem>
                  <MenuItem value="3">20,000 – 30,000</MenuItem>
                  <MenuItem value="4">30,000 – 40,000</MenuItem>
                  <MenuItem value="5">40,000 – 50,000</MenuItem>
                  <MenuItem value="6">More than 50,000</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Contact No" name="contact_no" value={editData.contact_no || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              {/* ADDRESS */}
              <Grid item xs={12} md={6}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Purok" name="purok" value={editData.purok || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Address" name="address" value={editData.address || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              {/* VOTER INFO */}
              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Registered Voter" name="is_voters" value={editData.is_voters} onChange={handleEditChange} fullWidth>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Precinct No" name="precint_no" value={editData.precint_no || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} label="Living in Barangay" name="living" value={editData.living || ""} onChange={handleEditChange} fullWidth />
              </Grid>

              {/* EMERGENCY CONTACT */}
              <Grid item xs={12}>
                <Typography fontWeight={600} mb={2}>
                  Emergency Contact
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField sx={{ width: "223px", height: "55px" }} label="Full Name" name="fullname_emergency" value={editData.fullname_emergency} onChange={handleEditChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField sx={{ width: "223px", height: "55px" }} label="Contact No" name="contact_no_emergency" value={editData.contact_no_emergency} onChange={handleEditChange} fullWidth />
                  </Grid>
                </Grid>
              </Grid>

              {/* STATUS */}
              <Grid item xs={12} md={4}>
                <TextField sx={{ width: "223px", height: "55px" }} select label="Resident Status" name="status" value={editData.status} onChange={handleEditChange} fullWidth>
                  <MenuItem value={1}>Alive</MenuItem>
                  <MenuItem value={0}>Deceased</MenuItem>
                </TextField>
              </Grid>

            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={updating}>
            {updating ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight="bold">Resident ID</Typography>

          <Button
            variant="contained"
            color="success"
            onClick={handlePrintID}
            className="no-print"
            size="small"
          >
            Print ID
          </Button>
        </DialogTitle>

        <DialogContent>
          {/* 🔴 THIS IS WHAT GETS PRINTED */}
          <div ref={printRef} className="print-id-only">
            <ResidentIDCard resident={preview} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request ID Card</DialogTitle>
        <DialogContent dividers sx={{ mt: 1 }}>
          <Grid container spacing={2}>

            <Grid item xs={12} md={4}>
              <TextField
                label="Surname"
                name="last_name"
                value={requestForm.last_name}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="First Name"
                name="first_name"
                value={requestForm.first_name}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Middle Name"
                name="middle_name"
                value={requestForm.middle_name}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={requestForm.address}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Birthdate"
                name="birthdate"
                value={requestForm.birthdate}
                InputLabelProps={{ shrink: true }}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Precinct No."
                name="precinct_no"
                value={requestForm.precinct_no}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="ID No."
                name="id_no"
                value={requestForm.id_no}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Date Issued"
                name="date_issued"
                value={requestForm.date_issued}
                InputLabelProps={{ shrink: true }}
                onChange={handleRequestChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Valid Until"
                fullWidth
                variant="outlined"
                value={requestForm.valid_until || ""}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, valid_until: e.target.value })
                }
                placeholder="Type text or pick a date"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setOpenDate(true)}>
                      <CalendarMonthIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRequestOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRequest}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openDate} onClose={() => setOpenDate(false)}>
        <Box sx={{ p: 2, background: "#fff", width: 300, m: "auto", mt: 10 }}>
          <Typography>Choose Date</Typography>
          <TextField
            type="date"
            fullWidth
            onChange={(e) => {
              setRequestForm({ ...requestForm, valid_until: e.target.value });
              setOpenDate(false);
            }}
          />
        </Box>
      </Modal>

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

      <style>
        {`
@media print {
  body * {
    visibility: hidden !important;
  }

  /* EMPTY FORM PRINT */
  .print-only,
  .print-only * {
    visibility: visible !important;
  }

  /* ID PRINT */
  .print-id-only,
  .print-id-only * {
    visibility: visible !important;
  }

  .print-only,
  .print-id-only {
    position: fixed;
    inset: 0;
    background: white;
  }

  .no-print,
  .hide-on-print {
    display: none !important;
  }

  @page {
    
    margin: 3mm;
  }
}
`}
      </style>

      {printEmptyForm && (
        <div className="print-only">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              padding: 2,
              boxSizing: "border-box",
              background: "white",
            }}
          >
            {/* CUT LINES */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",

                borderLeft: "1px dashed black",
                zIndex: 10,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                borderTop: "1px dashed black",
                zIndex: 10,
              }}
            />

            {/* 🔴 FORCE TRUE 2×2 GRID */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",

                width: "100%",
                height: "100%",   // 🔴 THIS FORCES EQUAL HEIGHTS
                gap: 2,
              }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "2px solid black",
                    padding: "20px",
                    boxSizing: "border-box",

                    fontFamily: "Arial",
                    fontSize: "12px",
                    background: "white",

                    display: "flex",          // ✅
                    flexDirection: "column",  // ✅

                  }}
                >
                  {/* HEADER */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: -2, mb: 1, ml: -1, mr: -1 }}>
                    {settings.logo_url && (
                      <img
                        src={`${API_BASE_URL}${settings.logo_url}`}
                        style={{ width: 50, height: 50, borderRadius: "50%", ml: -4 }}
                        alt="Barangay Logo"
                      />
                    )}
                    <img src={LungsodngManila} style={{ width: 50, height: 50 }} />
                  </Box>

                  <Typography
                    align="center"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      letterSpacing: 1,
                      mt: -7,
                      mb: 2,
                    }}
                  >
                    {settings.address &&
                      settings.address.split(/,\s*(?=DISTRICT)/i).map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i === 0 && <br />}
                        </React.Fragment>
                      ))}
                  </Typography>


                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "13px",
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    BARANGAY RESIDENT ID REQUEST FORM
                  </Typography>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center", }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>SURNAME:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>FIRST NAME:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>MIDDLE NAME:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>ADDRESS:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", }}>

                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px", mb: .5 }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "120px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>DATE OF BIRTH</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>PRECINCT NO.:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>ID NO.:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>DATE ISSUED:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  {/* CONTACT NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .5 }}>VALID UNTIL:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  <Typography sx={{ fontWeight: "bold", mt: 1, fontSize: "14px", mb: .5 }}>
                    CONTACT IN CASE OF EMERGENCY:
                  </Typography>

                  {["NAME", "PHONE NO."].map((label) => (
                    <Box key={label} sx={{ display: "flex", mb: "6px" }}>
                      <Typography sx={{ width: "105px", fontWeight: "bold", fontSize: "14px" }}>
                        {label}:
                      </Typography>
                      <Box sx={{ flexGrow: 1, borderBottom: "1px solid black" }} />
                    </Box>
                  ))}

                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Typography
                      sx={{
                        width: "105px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      SIGNATURE:
                    </Typography>

                    <Box
                      sx={{
                        flexGrow: 1,

                      }}
                    />
                  </Box>

                </Box>
              ))}
            </Box>
          </Box>
        </div>


      )}

      <Dialog open={openQR} onClose={handleCloseQR}>
        <DialogTitle>Resident QR Code</DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          {selectedResident && (
            <>
              <Typography sx={{ mb: 1 }}>
                {selectedResident.resident_code}
              </Typography>

              <QRCodeCanvas
                value={`${window.location.origin}/residentview?code=${selectedResident.resident_code}`}
                size={180}
                level="H"
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // 👈 TOP CENTER
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this resident?
            <br />
            This action is permanent and cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


    </Box>



  );
};

export default ResidentsPage;
