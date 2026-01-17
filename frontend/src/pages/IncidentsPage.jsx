// src/pages/IncidentsPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { SettingsContext } from "../App";
import {
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


const INCIDENT_TYPES = [
  'Complaint',
  'Blotter',
  'Domestic Violence',
  'Theft',
  'Vandalism',
  'Noise Disturbance',
  'Others',
];

const STATUS_OPTIONS = ['Open', 'Under Investigation', 'Closed', 'Others'];


const initialForm = {
  incident_date: '',
  incident_type: 'Complaint',
  other_incident_type: '',
  location: '',
  description: '',
  complainant_id: '',
  respondent_id: '',
  status: 'Open',
  other_status: '', // ✅ NEW
};



const IncidentsPage = () => {
  const { settings } = useContext(SettingsContext);
  const [residents, setResidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [errorEdit, setErrorEdit] = useState('');

  // Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };


  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 100; // change if you want

  const fetchResidents = async () => {
    try {
      const res = await api.get('/residents');
      setResidents(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching residents');
    }
  };

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/incidents');
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchIncidents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'incident_type' && value !== 'Others'
        ? { other_incident_type: '' }
        : {}),
      ...(name === 'status' && value !== 'Others'
        ? { other_status: '' }
        : {}),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    if (!form.incident_date || !form.incident_type) {
      setErrorForm('Date & time and Incident Type are required.');
      return;
    }

    if (
      form.incident_type === 'Others' &&
      !form.other_incident_type.trim()
    ) {
      setErrorForm('Please specify the incident type.');
      return;
    }

    if (
      form.status === 'Others' &&
      !form.other_status.trim()
    ) {
      setErrorForm('Please specify the status.');
      return;
    }

    // Normalize values before saving
    const payload = {
      ...form,
      incident_type:
        form.incident_type === 'Others'
          ? form.other_incident_type
          : form.incident_type,
      status:
        form.status === 'Others'
          ? form.other_status
          : form.status,
    };

    try {
      setSaving(true);
      await api.post('/incidents', payload);
      setForm(initialForm);
      await fetchIncidents();
      showSnackbar("Incident saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar(
        err.response?.data?.message || "Error saving incident",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const residentName = (id) => {
    const r = residents.find((x) => x.id === id);
    if (!r) return '';
    return `${r.last_name}, ${r.first_name}`;
  };

  const formatDateTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const filteredIncidents = incidents.filter((i) => {
    const dateOnly = i.incident_date ? i.incident_date.slice(0, 10) : '';
    const matchFrom = !dateFrom || dateOnly >= dateFrom;
    const matchTo = !dateTo || dateOnly <= dateTo;
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;

    // searchType/Location/Names
    const complainant = residentName(i.complainant_id);
    const respondent = residentName(i.respondent_id);
    const haystack = (
      `${i.incident_type || ''} ${i.location || ''} ${complainant} ${respondent}`
    ).toLowerCase();
    const matchSearch =
      !searchText.trim() ||
      haystack.includes(searchText.trim().toLowerCase());

    return matchFrom && matchTo && matchStatus && matchSearch;
  });

  const pagedIncidents = filteredIncidents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


  const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage);


  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, statusFilter, searchText]);

  // Edit
  const handleEditClick = (incident) => {
    setErrorEdit('');
    setEditData({
      ...incident,
      incident_date: incident.incident_date
        ? incident.incident_date.slice(0, 16)
        : '',
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExportIncidentsPDF = () => {
    if (filteredIncidents.length === 0) {
      alert("No incidents to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.text("Incident Reports / Blotter", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    });

    const body = filteredIncidents.map((i, index) => [
      index + 1,
      formatDateTime(i.incident_date),
      i.incident_type,
      i.location || "",
      residentName(i.complainant_id),
      residentName(i.respondent_id),
      i.status,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["#", "Date/Time", "Type", "Location", "Complainant", "Respondent", "Status"]],
      body,
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        lineWidth: 0.5,
        lineColor: [0, 0, 0], // black border
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.5,
        lineColor: [0, 0, 0], // black border for header
      },
    });

    doc.save("incidents.pdf");
  };


  const handleExportIncidentsExcel = () => {
    if (filteredIncidents.length === 0) {
      alert("No incidents to export");
      return;
    }

    const data = filteredIncidents.map((i, index) => ({
      "#": index + 1,
      "Date/Time": formatDateTime(i.incident_date),
      "Type": i.incident_type,
      "Location": i.location || "",
      "Complainant": residentName(i.complainant_id),
      "Respondent": residentName(i.respondent_id),
      "Status": i.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incidents");

    XLSX.writeFile(wb, "incidents.xlsx");
  };


  const handleEditSave = async () => {
    setErrorEdit('');
    if (!editData.incident_date || !editData.incident_type) {
      setErrorEdit('Date & time and Incident Type are required.');
      return;
    }

    try {
      setSavingEdit(true);
      await api.put(`/incidents/${editData.id}`, editData);
      setEditOpen(false);
      setEditData(null);
      await fetchIncidents();
      showSnackbar("Incident updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Error updating incident", "error");
    } finally {
      setSavingEdit(false);
    }

  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData(null);
  };

  // Delete
  const handleDeleteClick = (incident) => {
    setDeleteTarget(incident);
    setDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/incidents/${deleteTarget.id}`);
      setDeleteOpen(false);
      setDeleteTarget(null);
      await fetchIncidents();
      showSnackbar("Incident deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Error deleting incident", "error");
    } finally {
      setDeleting(false);
    }
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



  return (
    <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "times new roman", fontSize: "36px" }}>
          INCIDENT REPORTS / BLOTTER
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
                Incident Reports / Blotter
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Paper sx={{ p: 2, mb: 3, mt: -.5, border: "2px solid black" }} elevation={2}>

        <Typography variant="h6" gutterBottom>
          Add Incident
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                type="datetime-local"
                label="Date & Time"
                name="incident_date"
                value={form.incident_date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1} alignItems="center">

                {/* INCIDENT TYPE DROPDOWN */}
                <Grid item xs={form.incident_type === 'Others' ? 6 : 12}>
                  <FormControl fullWidth required>
                    <InputLabel>Incident Type</InputLabel>
                    <Select
                      label="Incident Type"
                      name="incident_type"
                      sx={{ width: "223px" }}
                      value={form.incident_type}
                      onChange={handleChange}
                    >
                      {INCIDENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* SPECIFY INCIDENT TYPE (ONLY WHEN OTHERS) */}
                {form.incident_type === 'Others' && (
                  <Grid item xs={6}>
                    <TextField
                      label="Specify Incident Type"
                      name="other_incident_type"
                      value={form.other_incident_type}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                )}

              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Location"
                name="location"
                sx={{ width: "223px" }}
                value={form.location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Complainant</InputLabel>
                <Select
                  label="Complainant"
                  name="complainant_id"
                  sx={{ width: "223px" }}
                  value={form.complainant_id}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {residents.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.last_name}, {r.first_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Respondent</InputLabel>
                <Select
                  label="Respondent"
                  name="respondent_id"
                  sx={{ width: "223px" }}
                  value={form.respondent_id}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {residents.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.last_name}, {r.first_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={1} alignItems="center">
                {/* STATUS DROPDOWN */}
                <Grid item xs={form.status === 'Others' ? 6 : 12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* SPECIFY STATUS (ONLY WHEN OTHERS) */}
                {form.status === 'Others' && (
                  <Grid item xs={6}>
                    <TextField
                      label="Specify Status"
                      name="other_status"
                      value={form.other_status}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                style={{ width: "500px", height: "100px" }}
                maxRows={6}
              />
            </Grid>

            {errorForm && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errorForm}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button sx={{ height: "55px", width: "223px" }} type="submit" variant="contained" disabled={saving || myRole === 'User'}>
                {saving ? 'Saving...' : 'Save Incident'}
              </Button>

              <Button sx={{ height: "55px", width: "223px", ml: 2 }} variant="contained"
                color="secondary" onClick={handleExportIncidentsPDF}>
                Export PDF
              </Button>

              <Button sx={{ height: "55px", width: "223px", ml: 2 }} variant="contained" color="success" onClick={handleExportIncidentsExcel}>
                Export Excel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Incident List */}
      <Paper sx={{ p: 2, border: "2px solid black" }} elevation={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // ⬅ split left & right
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          {/* LEFT SIDE */}
          <Typography variant="h6">
            Incident List
          </Typography>

          {/* RIGHT SIDE FILTERS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <TextField
              type="date"
              size="small"
              label="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="date"
              size="small"
              label="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Search (type / location / name)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 260 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>


        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "gray" }}>
              <TableRow>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>ID</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Date/Time</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Type</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Location</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Complainant</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Respondent</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Status</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Description</TableCell>
                <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedIncidents.map((i) => (
                <TableRow key={i.id}>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{i.id}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{formatDateTime(i.incident_date)}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{i.incident_type}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{i.location || ''}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{residentName(i.complainant_id)}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{residentName(i.respondent_id)}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{i.status}</TableCell>
                  <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>{i.description}</TableCell>
                  <TableCell sx={{ color: "black", textAlign: "center", width: "15%", py: 0.5, fontSize: "12px", border: "2px solid black" }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "green",
                          color: "white",
                          mr: 1,
                          width: "80px"
                        }}
                        onClick={() => handleEditClick(i)}
                        disabled={myRole === "User"}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{
                          backgroundColor: "#9E0000",
                          color: "white",
                          width: "80px"
                        }}
                        onClick={() => handleDeleteClick(i)}
                        disabled={myRole === "User"}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {pagedIncidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No incidents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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

      {/* Edit Incident Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Incident</DialogTitle>
        <DialogContent dividers>
          {editData && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  type="datetime-local"
                  label="Date & Time"
                  name="incident_date"
                  value={editData.incident_date || ''}
                  onChange={handleEditChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Incident Type</InputLabel>
                  <Select
                    label="Incident Type"
                    name="incident_type"
                    value={editData.incident_type || ''}
                    onChange={handleEditChange}
                  >
                    {INCIDENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Location"
                  name="location"
                  value={editData.location || ''}
                  onChange={handleEditChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Complainant</InputLabel>
                  <Select
                    label="Complainant"
                    name="complainant_id"
                    value={editData.complainant_id || ''}
                    onChange={handleEditChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {residents.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.last_name}, {r.first_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Respondent</InputLabel>
                  <Select
                    label="Respondent"
                    name="respondent_id"
                    value={editData.respondent_id || ''}
                    onChange={handleEditChange}

                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {residents.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.last_name}, {r.first_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FormControl sx={{ width: 223 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    value={editData.status || ''}
                    onChange={handleEditChange}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  sx={{ width: 223 }}
                  value={editData.description || ''}
                  onChange={handleEditChange}
                  multiline
                  minRows={3}
                  maxRows={6}
                />

              </Grid>

              {errorEdit && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2">
                    {errorEdit}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button
            onClick={async () => {
              await handleEditSave();
              await AuditMyAction("Updated resident information in Incident Page");
            }}
            variant="contained"
            disabled={savingEdit}
          >
            {savingEdit ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Incident</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete incident{' '}
            <strong>#{deleteTarget?.id}</strong> (
            {deleteTarget?.incident_type})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await handleDeleteConfirm();
              await AuditMyAction("Deleted resident information in Incident Page");
            }}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default IncidentsPage;
