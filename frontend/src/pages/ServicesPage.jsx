// src/pages/ServicesPage.jsx
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  MenuItem,
  InputAdornment,
  TablePagination,
  Snackbar,
  Alert

} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import BagongPilipinas from "../assets/BagongPilipinas.png";
import Barangay369 from "../assets/Barangay369.jpg";
import LungsodngManila from "../assets/LungsodngManila.jpg";
import api from '../api';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from 'xlsx';
import API_BASE_URL from '../ApiConfig';

const API_ROOT = `${API_BASE_URL}`;

const emptyService = {
  id: null,
  service_name: '',
  description: '',
  service_date: '',
  location: '',
};

const emptyBeneficiary = {
  resident_id: '',
  fullname: "",
  address: "",
  birthdate: "",
  age: "",
  is_senior: 0,
  civil_status: "",
  work: "",
  monthly_income: "",
  is_voter: 0,
  contact_no: "",
  date: new Date().toISOString().split("T")[0],
  notes: '',
};

const calculateAge = (birthdate) => {
  if (!birthdate) return '';
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const buildFullName = (r) =>
  `${r.last_name}, ${r.first_name} ${r.middle_name || ''} ${r.suffix || ''}`.trim();


const ServicesPage = () => {
  const { settings } = useContext(SettingsContext);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [residents, setResidents] = useState([]);

  // forms
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [beneficiaryForm, setBeneficiaryForm] = useState(emptyBeneficiary);

  // dialogs
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [beneficiaryDialogOpen, setBeneficiaryDialogOpen] = useState(false);
  const [deleteServiceDialogOpen, setDeleteServiceDialogOpen] =
    useState(false);
  const [deleteBeneficiaryDialogOpen, setDeleteBeneficiaryDialogOpen] =
    useState(false);

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // loading / errors
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [savingBeneficiary, setSavingBeneficiary] = useState(false);
  const [deletingService, setDeletingService] = useState(false);
  const [deletingBeneficiary, setDeletingBeneficiary] = useState(false);
  const [errorService, setErrorService] = useState('');
  const [errorBeneficiary, setErrorBeneficiary] = useState('');

  // filters & pagination
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchText, setSearchText] = useState('');
  const [seniorFilter, setSeniorFilter] = useState("all");
  const [seniorOnly, setSeniorOnly] = useState(false);

  // load all
  useEffect(() => {
    loadServices();
    loadResidents();
  }, []);

  const [printMode, setPrintMode] = useState(null);

  useEffect(() => {
    const reset = () => setPrintMode(null);
    window.addEventListener("afterprint", reset);
    return () => window.removeEventListener("afterprint", reset);
  }, []);

  useEffect(() => {
    if (seniorOnly && !isEditing) {
      setBeneficiaryForm((prev) => ({
        ...prev,
        is_senior: 1,
      }));
    }
  }, [seniorOnly, isEditing]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get('/services');
      setServices(res.data || []);
      // if current selected service was deleted, clear selection
      if (
        selectedService &&
        !res.data.find((s) => s.id === selectedService.id)
      ) {
        setSelectedService(null);
        setBeneficiaries([]);
      }
    } catch (err) {
      console.error('Error fetching services', err);
      showSnackbar("Error fetching services", "error");
    } finally {
      setLoadingServices(false);
    }
  };

  const loadResidents = async () => {
    try {
      const res = await api.get('/residents');
      setResidents(res.data || []);
    } catch (err) {
      console.error('Error fetching residents', err);
      showSnackbar("Error fetching residents", "error");
    }

  };

  const loadBeneficiaries = async (serviceId) => {
    if (!serviceId) return;
    try {
      setLoadingBeneficiaries(true);
      const res = await api.get(`/services/${serviceId}/beneficiaries`);
      setBeneficiaries(res.data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries', err);
      showSnackbar("Error fetching beneficiaries", "error");
    }
    finally {
      setLoadingBeneficiaries(false);
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    loadBeneficiaries(service.id);
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBeneficiaryFormChange = (e) => {
    const { name, value } = e.target;

    // When resident is selected
    if (name === 'resident_id') {
      const resident = residents.find(
        (r) => String(r.id) === String(value)
      );

      if (resident) {
        setBeneficiaryForm((prev) => ({
          ...prev,
          resident_id: value,
          fullname: buildFullName(resident),
          address: resident.address || '',
          birthdate: resident.birthdate || '',
          age: calculateAge(resident.birthdate),
          is_senior: resident.is_senior ? 1 : 0,
          civil_status: resident.civil_status || '',
          work: resident.work || '',
          monthly_income: resident.monthly_income || '',
          is_voter: resident.is_voters ? 1 : 0,
          contact_no: resident.contact_no || '',
          date: new Date().toISOString().split('T')[0],
        }));
      }
      return;
    }

    // Normal field update
    setBeneficiaryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditServiceDialog = (service) => {
    setIsEditingService(true);
    setServiceForm({
      id: service.id,
      service_name: service.service_name || '',
      description: service.description || '',
      service_date: service.service_date
        ? service.service_date.slice(0, 10)
        : '',
      location: service.location || '',
    });
    setErrorService('');
    setServiceDialogOpen(true);
  };


  const validateServiceForm = () => {
    if (!serviceForm.service_name.trim()) {
      return 'Service name is required.';
    }
    return '';
  };

  const handleSaveService = async () => {
    const validationError = validateServiceForm();
    if (validationError) {
      setErrorService(validationError);
      return;
    }
    setIsEditingService(false);
    setServiceForm(emptyService);

    try {
      setSavingService(true);
      if (isEditingService && serviceForm.id) {
        await api.put(`/services/${serviceForm.id}`, serviceForm);
      } else {
        await api.post('/services', serviceForm);
      }
      setServiceDialogOpen(false);
      await loadServices();
      if (isEditingService && serviceForm.id) {
        showSnackbar("Service updated successfully", "success");
      } else {
        showSnackbar("Service added successfully", "success");
      }

    } catch (err) {
      console.error('Error saving service', err);
      const msg = err.response?.data?.message || "Error saving service";
      setErrorService(msg);
      showSnackbar(msg, "error");
    }
    finally {
      setSavingService(false);
    }
  };

  const openDeleteServiceDialog = (service) => {
    setServiceToDelete(service);
    setDeleteServiceDialogOpen(true);
  };

  const closeDeleteServiceDialog = () => {
    setDeleteServiceDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setDeletingService(true);
      await api.delete(`/services/${serviceToDelete.id}`);
      setDeleteServiceDialogOpen(false);
      setServiceToDelete(null);
      await loadServices();
    } catch (err) {
      console.error('Error deleting service', err);
      const msg = err.response?.data?.message || "Error deleting service";
      showSnackbar(msg, "error");
      showSnackbar("Service deleted successfully", "success");

    }
    finally {
      setDeletingService(false);
    }
  };

  const openAddBeneficiaryDialog = () => {
    if (!selectedService) {
      showSnackbar("Please select a service first", "warning");
      return;
    }

    setBeneficiaryForm(emptyBeneficiary);
    setErrorBeneficiary('');
    setIsEditing(false);

    setEditingBeneficiaryId(null);
    setBeneficiaryDialogOpen(true);
  };

  const openEditBeneficiaryDialog = (b) => {
    setBeneficiaryForm({
      resident_id: b.resident_id,
      fullname: b.fullname,
      address: b.address,
      birthdate: b.birthdate,
      age: b.age,
      is_senior: b.is_senior,
      civil_status: b.civil_status,
      work: b.work,
      monthly_income: b.monthly_income,
      is_voter: b.is_voters,
      contact_no: b.contact_no,
      notes: b.notes,
    });

    setEditingBeneficiaryId(b.id);
    setIsEditing(true);
    setBeneficiaryDialogOpen(true);
  };

  const closeBeneficiaryDialog = () => {
    setBeneficiaryDialogOpen(false);
  };

  const validateBeneficiaryForm = () => {
    if (!beneficiaryForm.resident_id) {
      return 'Please choose a resident.';
    }
    // check duplicate
    const exists = beneficiaries.some(
      (b) =>
        String(b.resident_id) === String(beneficiaryForm.resident_id) &&
        (!isEditing || b.id !== editingBeneficiaryId)
    );

    if (exists) {
      return 'This resident is already a beneficiary for this service.';
    }
    return '';
  };

  const handleEditBeneficiary = async () => {
    try {
      setSavingBeneficiary(true);

      const editingBeneficiaryId = beneficiaryForm.resident_id;

      await api.put(
        `/services/${selectedService.id}/beneficiaries/${editingBeneficiaryId}`,
        {
          resident_id: beneficiaryForm.resident_id,
          fullname: beneficiaryForm.fullname,
          address: beneficiaryForm.address || '',
          birthdate: beneficiaryForm.birthdate || '',
          age: calculateAge(beneficiaryForm.birthdate),
          civil_status: beneficiaryForm.civil_status || '',
          is_senior: beneficiaryForm.is_senior ? 1 : 0,
          work: beneficiaryForm.work || '',
          monthly_income: beneficiaryForm.monthly_income ?? '',
          is_voter: beneficiaryForm.is_voter ? 1 : 0,
          contact_no: beneficiaryForm.contact_no || '',
          notes: beneficiaryForm.notes || null,
        }
      );

      setBeneficiaryDialogOpen(false);
      await loadBeneficiaries(selectedService.id);

      // ✅ SUCCESS SNACKBAR
      showSnackbar("Beneficiary updated successfully", "success");

    } catch (err) {
      console.error(err);
      setErrorBeneficiary('Error updating beneficiary');

      // ❌ ERROR SNACKBAR
      showSnackbar("Failed to update beneficiary", "error");

    } finally {
      setSavingBeneficiary(false);
    }
  };

  const handleSaveBeneficiary = async () => {
    const validationError = validateBeneficiaryForm();
    if (validationError) {
      setErrorBeneficiary(validationError);
      showSnackbar(validationError, "warning"); // ⚠️ validation feedback
      return;
    }
    if (!selectedService) return;

    try {
      setSavingBeneficiary(true);

      await api.post(`/services/${selectedService.id}/beneficiaries`, {
        resident_id: beneficiaryForm.resident_id,
        fullname: beneficiaryForm.fullname,
        address: beneficiaryForm.address || '',
        birthdate: beneficiaryForm.birthdate || '',
        age: calculateAge(beneficiaryForm.birthdate),
        is_senior: beneficiaryForm.is_senior ? 1 : 0,
        civil_status: beneficiaryForm.civil_status || '',
        work: beneficiaryForm.work || '',
        monthly_income: beneficiaryForm.monthly_income || '',
        is_voter: beneficiaryForm.is_voter ? 1 : 0,
        contact_no: beneficiaryForm.contact_no || '',
        notes: beneficiaryForm.notes,
      });

      setBeneficiaryDialogOpen(false);
      await loadBeneficiaries(selectedService.id);

      // ✅ SUCCESS SNACKBAR
      showSnackbar("Beneficiary added successfully", "success");

    } catch (err) {
      console.error('Error saving beneficiary', err);
      const msg =
        err.response?.data?.message || 'Error saving beneficiary';
      setErrorBeneficiary(msg);

      // ❌ ERROR SNACKBAR
      showSnackbar(msg, "error");

    } finally {
      setSavingBeneficiary(false);
    }
  };

  const openDeleteBeneficiaryDialog = (beneficiary) => {
    setBeneficiaryToDelete(beneficiary);
    setDeleteBeneficiaryDialogOpen(true);
  };

  const closeDeleteBeneficiaryDialog = () => {
    setDeleteBeneficiaryDialogOpen(false);
    setBeneficiaryToDelete(null);
  };

  const handleDeleteBeneficiary = async () => {
    if (!selectedService || !beneficiaryToDelete) return;

    try {
      setDeletingBeneficiary(true);

      const serviceID = selectedService.id;
      const beneficiaryID = beneficiaryToDelete.resident_id;

      await api.delete(
        `/services/${serviceID}/beneficiaries/${beneficiaryID}`
      );

      setDeleteBeneficiaryDialogOpen(false);
      setBeneficiaryToDelete(null);
      await loadBeneficiaries(selectedService.id);

      // ✅ SUCCESS SNACKBAR
      showSnackbar("Beneficiary removed successfully", "success");

    } catch (err) {
      console.error('Error deleting beneficiary', err);

      const msg =
        err.response?.data?.message || 'Error deleting beneficiary';

      // ❌ ERROR SNACKBAR
      showSnackbar(msg, "error");

    } finally {
      setDeletingBeneficiary(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-PH', { dateStyle: 'medium' });
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 100; // change if you want

  const filteredResidents = seniorOnly
    ? residents.filter(r => Number(r.is_senior) === 1)
    : residents;

  const filteredServices = services.filter((s) => {
    const dateOnly = s.service_date ? s.service_date.slice(0, 10) : '';
    const matchFrom = !dateFrom || dateOnly >= dateFrom;
    const matchTo = !dateTo || dateOnly <= dateTo;

    const haystack = (
      `${s.service_name || ''} ${s.location || ''} ${s.description || ''}`
    ).toLowerCase();

    const matchSearch =
      !searchText.trim() ||
      haystack.includes(searchText.trim().toLowerCase());

    return matchFrom && matchTo && matchSearch;
  });

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    if (seniorFilter === "senior") return Number(b.is_senior) === 1;
    if (seniorFilter === "non-senior") return Number(b.is_senior) === 0;
    return true; // "all"
  });

  const pagedServices = filteredServices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / rowsPerPage)
  );

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, searchText, services]);

  const residentName = (id) => {
    const r = residents.find((x) => x.id === id);
    if (!r) return '';
    return `${r.last_name}, ${r.first_name}`;
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


  const handleExportPdf = () => {
    if (!selectedService || beneficiaries.length === 0) {
     showSnackbar("No beneficiaries to export.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.text("Barangay Service Beneficiaries", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(`Service: ${selectedService.service_name}`, doc.internal.pageSize.width / 2, 22, {
      align: "center",
    });

    const body = beneficiaries.map((b, i) => [
      i + 1,
      b.fullname,
      b.address,
      b.age,
      b.birthdate,
      b.civil_status,
      b.work,
      incomeLabel(b.monthly_income),
      b.contact_no,
      Number(b.is_voters) === 1 ? "Yes" : "No",
      b.notes || "",
    ]);

    autoTable(doc, {
      startY: 28,
      head: [[
        "#",
        "Name",
        "Address",
        "Age",
        "Date Of Birth",
        "Civil Status",
        "Work",
        "Monthly Income Exceeding",
        "Contact Number",
        "Registered Voter",
        "Notes",
      ]],
      body,
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
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

    doc.save(`service_${selectedService.id}_beneficiaries.pdf`);
  };

  // Export: Excel
  const handleExportExcel = () => {
    if (!selectedService || beneficiaries.length === 0) {
     showSnackbar("No beneficiaries to export.");
      return;
    }

    // ✅ check if all are senior citizens
    const allSenior = beneficiaries.every(
      (b) => Number(b.is_senior) === 1
    );

    const data = beneficiaries.map((b, i) => ({
      "#": i + 1,
      Name: b.fullname,
      Address: b.address,
      Age: b.age,
      "Date Of Birth": b.birthdate,
      "Civil Status": b.civil_status,
      Work: b.work,
      "Monthly Income Exceeding": incomeLabel(b.monthly_income),
      "Contact Number": b.contact_no,
      "Registered Voter": Number(b.is_voters) === 1 ? "Yes" : "No",
      Notes: b.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries");

    const fileName = allSenior
      ? "List_of_Senior_Citizen_Beneficiary.xlsx"
      : `service_${selectedService.id}_beneficiaries.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const [myRole, setMyRole] = useState("");
  const [myData, setMyData] = useState(null);

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



  return (
    <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "times new roman", fontSize: "36px" }}>
          SERVICES / MEDICAL MISSIONS
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
                  marginLeft: "-50px",
                  border: "3px solid black"
                }}
              >
                SERVICES
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <Paper
        sx={{
          p: 2,
          mt: -.5,
          mb: 2,
          border: "2px solid black",
        }}
        elevation={2}
      >
        <Typography variant="h6" gutterBottom>
          Services:
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">


          {/* RIGHT — ADD SERVICE FORM */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Service Name *"
                  name="service_name"
                  value={serviceForm.service_name}
                  onChange={handleServiceFormChange}
                  fullWidth
                  sx={{ width: "223px", height: "55px" }}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Date"
                  type="date"
                  name="service_date"
                  value={serviceForm.service_date}
                  sx={{ width: "223px", height: "55px" }}
                  onChange={handleServiceFormChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Location"
                  name="location"
                  value={serviceForm.location}
                  sx={{ width: "223px", height: "55px" }}
                  onChange={handleServiceFormChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={serviceForm.description}
                  sx={{ width: "223px", height: "55px" }}
                  onChange={handleServiceFormChange}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                />
              </Grid>

              {errorService && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2">
                    {errorService}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={handleSaveService}
                  disabled={savingService || myRole === 'User'}
                  sx={{ height: "55px", width: "223px" }}
                >
                  {savingService
                    ? "Saving..."
                    : isEditingService
                      ? "SAVE"
                      : "ADD"}
                </Button>


                <Button
                  variant="contained"
                  className="hide-on-print"
                  onClick={() => {
                    setPrintMode("scholarship");
                    setTimeout(() => window.print(), 100);
                  }}
                  sx={{ height: "55px", width: "250px", ml: 2 }}
                >
                  Print Scholarship Form
                </Button>


              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>



      <Grid container spacing={2}>
        {/* Services list */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, border: "2px solid black", width: "1100px" }} elevation={1}>
            {/* HEADER ROW */}
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
              {/* LEFT */}
              <Typography variant="h6">
                Services
              </Typography>

              {/* RIGHT */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <TextField
                  label="From"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="To"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Search (name / location / description)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="small"
                  sx={{ width: 280 }}
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

            {/* TABLE */}
            {loadingServices ? (
              <Typography>Loading services...</Typography>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "gray", width: "100%" }}>
                      <TableRow>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Service Name
                        </TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Location
                        </TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Beneficiaries
                        </TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Description
                        </TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {pagedServices.map((s) => (
                        <TableRow
                          key={s.id}
                          hover
                          selected={selectedService?.id === s.id}
                          onClick={() => handleSelectService(s)}
                          sx={{ cursor: "pointer", width: "100%" }}
                        >
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>
                            {s.service_name}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>
                            {formatDate(s.service_date)}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>
                            {s.location || ""}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>
                            {s.beneficiary_count || 0}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }}>
                            {s.description}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid black", textAlign: "center" }} align="center">
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "green",
                                color: "white",
                                width: "80px",
                                mr: 1,
                                "&:hover": {
                                  backgroundColor: "#178888",
                                },
                              }}
                              disabled={myRole === "User"}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditServiceDialog(s);
                              }}
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
                                "&:hover": {
                                  backgroundColor: "#7a0000",
                                },
                              }}
                              disabled={myRole === "User"}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteServiceDialog(s);
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>

                        </TableRow>
                      ))}
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
              </>
            )}
          </Paper>

        </Grid>

        {/* Selected service + beneficiaries */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, mb: 2, border: "2px solid black" }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Service Details
            </Typography>
            {selectedService ? (
              <>
                <Typography variant="subtitle1">
                  {selectedService.service_name}
                </Typography>
                <Typography variant="body2">
                  Date:{' '}
                  {selectedService.service_date
                    ? formatDate(selectedService.service_date)
                    : ''}
                </Typography>
                <Typography variant="body2">
                  Location: {selectedService.location || ''}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedService.description || <em>No description</em>}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#2e7d32", // green
                      color: "white",
                      height: "55px", width: "223px", ml: 2,
                    }}
                    onClick={openAddBeneficiaryDialog}
                    disabled={myRole === "User"}
                  >
                    Add Beneficiary
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      color: "white",
                      height: "55px", width: "223px", ml: 2,
                    }}
                    onClick={handleExportPdf}
                    disabled={beneficiaries.length === 0}
                  >
                    Export PDF
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      color: "white",
                      height: "55px", width: "223px", ml: 2,
                    }}
                    onClick={handleExportExcel}
                    disabled={beneficiaries.length === 0}
                  >
                    Export Excel
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2">
                Select a service to view details and beneficiaries.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 2, border: "2px solid black" }} elevation={2}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <Typography variant="h6" gutterBottom>
                Beneficiaries
              </Typography>

              <TextField
                select
                label="Filter"
                size="small"
                value={seniorFilter}
                onChange={(e) => setSeniorFilter(e.target.value)}
                sx={{ width: 200 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="senior">Senior Citizens</MenuItem>
                <MenuItem value="non-senior">Non-Senior</MenuItem>
              </TextField>
            </Box>
            {loadingBeneficiaries ? (
              <Typography>Loading beneficiaries...</Typography>
            ) : beneficiaries.length === 0 ? (
              <Typography variant="body2">
                {selectedService
                  ? 'No beneficiaries yet for this service.'
                  : 'Select a service to view beneficiaries.'}
              </Typography>
            ) : filteredBeneficiaries.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
                {seniorFilter === "senior"
                  ? "No senior citizens found."
                  : seniorFilter === "non-senior"
                    ? "No non-senior beneficiaries found."
                    : "No beneficiaries available."}
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "gray" }}>
                    <TableRow>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>#</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Name</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Address</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Age</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Senior</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Date Of Birth</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Civil Status</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Work</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Monthly Income Exceeding</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Contact Number</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Register Voter</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }}>Notes</TableCell>
                      <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "white", }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBeneficiaries.map((b, index) => (
                      <TableRow key={b.id}>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.fullname}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.address}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.age}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {Number(b.is_senior) === 1 ? "Yes" : "No"}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.birthdate}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.civil_status}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.work}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.monthly_income === 0
                            ? "Less than 5000"
                            : b.monthly_income === 1
                              ? "5000 to 10000"
                              : b.monthly_income === 2
                                ? "10000 to 20000"
                                : b.monthly_income === 3
                                  ? "20000 to 30000"
                                  : b.monthly_income === 4
                                    ? "30000 to 40000"
                                    : b.monthly_income === 5
                                      ? "40000 to 50000"
                                      : b.monthly_income === 6
                                        ? "More than 50000"
                                        : ""}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {b.contact_no}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>
                          {Number(b.is_voters) === 1 ? "Yes" : "No"}
                        </TableCell >
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }}>{b.notes || ''}</TableCell>
                        <TableCell sx={{ border: "2px solid black", textAlign: "center", color: "black" }} align="center">
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "green",
                              color: "white",
                              width: "80px",
                              marginRight: "10px",
                              "&:hover": {
                                backgroundColor: "#178888",
                              },
                            }}
                            onClick={() => openEditBeneficiaryDialog(b)}
                            disabled={myRole === "User"}
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
                              "&:hover": {
                                backgroundColor: "#7a0000",
                              },
                            }}
                            onClick={() => openDeleteBeneficiaryDialog(b)}
                            disabled={myRole === "User"}
                          >
                            Delete
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Service dialog */}

      {/* Beneficiary dialog */}
      <Dialog
        open={beneficiaryDialogOpen}
        onClose={closeBeneficiaryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {isEditing ? 'Edit Beneficiary' : 'Add Beneficiary'}
          {!isEditing && (
            <label>
              <input
                type="checkbox"
                checked={seniorOnly}
                onChange={(e) => setSeniorOnly(e.target.checked)}
              /> Senior Citizen
            </label>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                select
                label="Resident"
                name="resident_id"
                value={beneficiaryForm.resident_id}
                onChange={handleBeneficiaryFormChange}
                fullWidth
                required
                sx={{ width: "150px" }}
              >
                {filteredResidents.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.last_name}, {r.first_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullname"
                value={beneficiaryForm.fullname}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={beneficiaryForm.address}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Date of Birth"
                name="birthdate"
                value={beneficiaryForm.birthdate}
                onChange={handleBeneficiaryFormChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Age"
                name="age"
                value={beneficiaryForm.age}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Is the resident a senior?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={beneficiaryForm.is_senior === 1}
                    onChange={() =>
                      setBeneficiaryForm((p) => ({ ...p, is_senior: 1 }))
                    }
                  /> Yes
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={beneficiaryForm.is_senior === 0}
                    onChange={() =>
                      setBeneficiaryForm((p) => ({ ...p, is_senior: 0 }))
                    }
                  /> No
                </label>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Civil Status"
                name="civil_status"
                value={beneficiaryForm.civil_status}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Work"
                name="work"
                value={beneficiaryForm.work}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                label="Monthly Income Exceeding"
                name="monthly_income"
                value={beneficiaryForm.monthly_income ?? ""}
                onChange={handleBeneficiaryFormChange}
                fullWidth
                sx={{ width: "240px" }}
              >
                <MenuItem value={0}>Less than 5000</MenuItem>
                <MenuItem value={1}>5000 to 10000</MenuItem>
                <MenuItem value={2}>10000 to 20000</MenuItem>
                <MenuItem value={3}>20000 to 30000</MenuItem>
                <MenuItem value={4}>30000 to 40000</MenuItem>
                <MenuItem value={5}>40000 to 50000</MenuItem>
                <MenuItem value={6}>More than 50000</MenuItem>
              </TextField>
            </Grid>

            {/* Registered voter */}
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Is the resident a registered voter?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={beneficiaryForm.is_voter === 1}
                    onChange={() =>
                      setBeneficiaryForm((p) => ({ ...p, is_voter: 1 }))
                    }
                  /> Yes
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={beneficiaryForm.is_voter === 0}
                    onChange={() =>
                      setBeneficiaryForm((p) => ({ ...p, is_voter: 0 }))
                    }
                  /> No
                </label>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Contact No"
                name="contact_no"
                value={beneficiaryForm.contact_no}
                onChange={handleBeneficiaryFormChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Date"
                name="date"
                value={beneficiaryForm.date}
                onChange={handleBeneficiaryFormChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={beneficiaryForm.notes}
                onChange={handleBeneficiaryFormChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            {errorBeneficiary && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errorBeneficiary}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBeneficiaryDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={isEditing ? handleEditBeneficiary : handleSaveBeneficiary}
            disabled={savingBeneficiary}
          >
            {savingBeneficiary ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>



      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // 👈 TOP CENTER
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>




      {/* Delete service dialog */}
      <Dialog
        open={deleteServiceDialogOpen}
        onClose={closeDeleteServiceDialog}
      >
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete service{' '}
            <strong>{serviceToDelete?.service_name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            If this service has beneficiaries, you may need to remove them
            first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteServiceDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteService}
            disabled={deletingService}
          >
            {deletingService ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete beneficiary dialog */}
      <Dialog
        open={deleteBeneficiaryDialogOpen}
        onClose={closeDeleteBeneficiaryDialog}
      >
        <DialogTitle>Remove Beneficiary</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Remove{' '}
            <strong>
              {beneficiaryToDelete
                ? `${beneficiaryToDelete.last_name}, ${beneficiaryToDelete.first_name}`
                : ''}
            </strong>{' '}
            from this service?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteBeneficiaryDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteBeneficiary}
            disabled={deletingBeneficiary}
          >
            {deletingBeneficiary ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
    /* Screen: show normal UI, hide the print-only sheet */
 @media screen {
  .print-only {
    display: none !important;
  }
}

@media print {
  body * {
    visibility: hidden !important;
  }

  .print-only.active-print,
  .print-only.active-print * {
    visibility: visible !important;
  }

  .print-only.active-print {
    position: fixed !important;
    left: 0;
    top: 0;
  margin-top: 10px;
    width: 100%;
    background: white;
  }

  .hide-on-print {
    display: none !important;
  }

  @page {
    margin: 3mm;
  }
}
  `}
      </style>

      <div className={`print-only ${printMode === "scholarship" ? "active-print" : ""}`}>
        <Box
          sx={{
            width: "100%",
            position: "relative",
            padding: 2,

          }}
        >

          {/* VERTICAL CUT LINE (center) */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "0",
              borderLeft: "1px dashed black",
              zIndex: 10
            }}
          />

          {/* HORIZONTAL CUT LINE (middle) */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: "0",
              borderTop: "1px dashed black",
              zIndex: 10
            }}
          />

          {/* --- YOUR 4 FORMS --- */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 2
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "48%",
                  border: "2px solid black",
                  padding: "20px",
                  fontFamily: "Arial",
                  fontSize: "13px",
                  position: "relative",
                  background: "white"
                }}
              >
                {/* HEADER LOGOS */}
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

                {/* REQUEST FORM FOR */}
                <Typography sx={{ fontWeight: "bold", fontSize: "14px", mb: .7 }}>
                  REQUEST FORM FOR AKAP CERTIFICATION
                </Typography>

                {/* CHECKBOXES */}
                <Box sx={{ ml: 1, }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{
                      width: 15,
                      height: 15,
                      border: "1px solid black",
                      borderRadius: "50%",
                      fontSize: "14px",
                      mr: 1, mb: .7


                    }} />
                    AKAP CERTIFICATION FOR SCHOLARSHIP
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", }}>
                    <Box sx={{
                      width: 15,
                      height: 15,
                      border: "1px solid black",
                      borderRadius: "50%",
                      fontSize: "14px",
                      mr: 1, mb: .7
                    }} />
                    BARANGAY INDIGENCY
                  </Box>
                </Box>

                {/* --- FIELD LINES (NO HELPER FUNCTION!) --- */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
                  <Typography sx={{ width: "100px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>FULL NAME:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ width: "75px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>ADDRESS:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>



                <Box sx={{ display: "flex", alignItems: "center", }}>
                  <Typography sx={{ width: "120px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>DATE OF BIRTH:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>

                {/* AGE + CIVIL STATUS */}
                <Box sx={{ display: "flex", }}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100px" }}>
                    <Typography sx={{ width: "50px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>AGE:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, ml: 1 }}>
                    <Typography sx={{ width: "120px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>CIVIL STATUS:</Typography>
                    <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography sx={{ width: "75px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>WORK:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography sx={{ width: "220px", fontWeight: "bold", fontSize: "13px", mb: .7 }}>MONTHLY INCOME EXCEEDING:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>


                {/* REGISTERED VOTER */}
                <Box sx={{ mb: 1 }}>
                  {/* Question on its own line */}
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px", mb: .7 }}>
                    Are you a Registered Voter?
                  </Typography>

                  {/* YES and NO on one row */}
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: 4, mb: .7 }}>

                    {/* YES */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: .7 }}>
                      <Box
                        sx={{
                          width: 13,
                          height: 13,
                          border: "1px solid black",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                        YES
                      </Typography>
                    </Box>

                    {/* NO */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: .7 }}>
                      <Box
                        sx={{
                          width: 13,
                          height: 13,
                          border: "1px solid black",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                        NO
                      </Typography>
                    </Box>

                  </Box>
                </Box>




                {/* CONTACT NO */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ width: "110px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>CONTACT NO.:</Typography>
                  <Box sx={{ borderBottom: "1px solid black", flexGrow: 1, height: "20px" }} />
                </Box>

                <Box sx={{ display: "flex", mt: 1, alignItems: "center" }}>
                  <Typography sx={{ width: "60px", fontWeight: "bold", fontSize: "14px", mb: .7 }}>
                    DATE:
                  </Typography>

                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      width: "150px",
                      height: "20px",
                      mr: 2,
                    }}
                  />

                </Box>

                {/* FOOTER */}

                <Typography sx={{ fontSize: "12px", mt: 1 }}>
                  Messenger: Sec Gilda Peralta Matabang
                </Typography>


                <Typography sx={{ fontSize: "12px", mt: 1 }}>
                  Request Form:     (Look for Sec. Gilda / Steve Matabang)
                </Typography>


              </Box>
            ))}
          </Box>



        </Box>
      </div>

    </Box >
  );
};

export default ServicesPage;
