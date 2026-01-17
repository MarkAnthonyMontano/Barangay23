// src/pages/CertificatesPage.jsx
import React, { useEffect, useMemo, useState, useRef, useContext } from "react";
import { SettingsContext } from "../App";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Card,
  Button,
  Modal,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  Snackbar,
  Alert,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../api";
import jsPDF from "jspdf";
import BagongPilipinas from "../assets/BagongPilipinas.png";
import Barangay369 from "../assets/Barangay369.jpg";
import LungsodngManila from "../assets/LungsodngManila.jpg";
import html2canvas from "html2canvas";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import API_BASE_URL from "../ApiConfig";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { QRCodeCanvas } from "qrcode.react";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AutoAwesomeMosaicOutlined } from "@mui/icons-material";

const API_ROOT = `${API_BASE_URL}`;

export const CERTIFICATE_TYPES = [
  {
    value: "barangay_indigency",
    label: "Barangay Certificate of Indigency", // for dropdown
    title: (
      <>
        Barangay Certificate
        <br />
        of Indigency
      </>
    ),
  },
  {
    value: "indigency_minor",
    label: "Certificate of Indigency For Minor",
    title: (
      <>
        Certificate of Indigency
        <br />
        For Minor
      </>
    ),
  },

  {
    value: "indigency_legal_age",
    label: "Certificate of Indigency For Legal Age",
    title: (
      <>
        Certificate of Indigency
        <br />
        For Legal Age
      </>
    ),
  },
  {
    value: "residency",
    label: "Barangay Certificate of Residency",
    title: (
      <>
        Barangay Certificate
        <br />
        of Residency
      </>
    ),
  },
  {
    value: "barangay_certificate",
    label: "Barangay Certification", // used in Typography / mainTitle
    dropdownLabel: "Barangay Certification Jobseeker", // used in TextField only
  },
  { value: "barangay_certification", label: "Barangay Certificate" },
  { value: "business_permit", label: "Business Permit" },
  { value: "awknowledgement_receipt", label: "Awknowledgement Receipt" },
  { value: "custom", label: "Other (Specify)" },
];

const certificateOptions = [
  {
    value: "ra_11261",
    label: "(First Time Jobseekers Assistance Act – RA 11261)",
  },
  { value: "barangay_certificate", label: "Barangay Certification" },
];

export const CERTIFICATE_SUBTITLES = [
  {
    value: "ra_11261",
    label: "(First Time Jobseekers Assistance Act – RA 11261)",
  },
  { value: "ra_10968", label: "Special Skills Training Program – RA 10968" },
  { value: "ra_11230", label: "Employment Facilitation Program – RA 11230" },
  { value: "custom", label: "Other (Specify)" },
];

const oathStatements = [
  "That this is the first time that I will actively look for a job, and therefore requesting that a Barangay Certification be issued in my favor to avail the benefits of the law;",
  "That I am aware that the benefits and privileges under the said law shall be valid only for one (1) year from the date that the Barangay Certification is issued;",
  "That I can avail the benefits of the law only once;",
  "That I understand that my personal information shall be included in the Roster/List of First Time Jobseekers and will not be used for any unlawful purpose;",
  "That I will inform and/or report to the Barangay personally, through text or other means, or through my family/relatives once I get employed;",
  "That I am not a beneficiary of the JobStart Program under R.A. No. 10869 and other laws that give similar exemptions for the documentary requirements exempted under R.A. No. 11261;",
  "That if issued this requested Certification, I will not use the same in any fraudulent manner nor shall I sell nor help and/or assist in the fabrication of the said certification;",
  "That this undertaking is made solely for the purpose of obtaining a Barangay Certification consistent with the objective of R.A. No. 11261 and not for any other purpose;",
  "That I consent to the use of my personal information pursuant to the Data Privacy Act and other applicable laws, rules and regulations;",
];

  function numberToWords(num) {
    if (num == null || num === "" || isNaN(num)) {
      return "";
    }

    const ones = [
      "", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty",
      "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    if (num === 0) return "Zero";

    if (num < 20) return ones[num];

    if (num < 100) {
      return tens[Math.floor(num / 10)] +
        (num % 10 ? " " + ones[num % 10] : "");
    }

    if (num < 1000) {
      return ones[Math.floor(num / 100)] + " Hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "");
    }

    if (num < 1_000_000) {
      return numberToWords(Math.floor(num / 1000)) + " Thousand" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "");
    }

    if (num < 1_000_000_000) {
      return numberToWords(Math.floor(num / 1_000_000)) + " Million" +
        (num % 1_000_000 ? " " + numberToWords(num % 1_000_000) : "");
    }

    return num.toString(); // fallback
  }

const CertificatesPage = ({ resident }) => {
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);
  const previewRef = useRef(null);
  const barangayCertRef = useRef(null);
  const oathRef = useRef(null);
  const acknowledgementRef = useRef(null);
  const [residents, setResidents] = useState([]);
  const [selectedResidentId, setSelectedResidentId] = useState(""); 

  const [certType, setCertType] = useState("residency");
  const [purpose, setPurpose] = useState("");
  const [secretaryName, setSecretaryName] = useState("");

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
  };

  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const formattedIssueDate = new Date(issueDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const [validDate, setValidDate] = useState(addMonths(new Date(), 6));

  const [barangayName, setBarangayName] = useState("Barangay 369, Zone 37");
  const [municipality, setMunicipality] = useState("District III, Sta Cruz");
  const [province, setProvince] = useState("City of Manila");
  const [captainName, setCaptainName] = useState("");

  const [placeIssued, setPlaceIssued] = useState("Barangay Hall");
  const [orNumber, setOrNumber] = useState("");
  const [error, setError] = useState("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loadingProfile, setProfileLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessNature, setBusinessNature] = useState("");
  const [amount, setAmount] = useState("");
  const [customCert, setCustomCert] = useState("");

  const [subtitleType, setSubtitleType] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");

  const [bornOn, setBornOn] = useState("");
  const [minorAddress, setMinorAddress] = useState("");
  const [parentsName, setParentsName] = useState("");
  const [parentsVoterAddress, setParentsVoterAddress] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const isBarangayCertificate = certType === "barangay_certificate";
  const isAcknowledgementReceipt = certType === "awknowledgement_receipt";

  const [residentAddress, setResidentAddress] = useState("");
  const [printMode, setPrintMode] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const reset = () => setPrintMode(null);
    window.addEventListener("afterprint", reset);
    return () => window.removeEventListener("afterprint", reset);
  }, []);

  const isRA11261 = selectedCertificate === "ra_11261";
  const words = numberToWords(amount);
  const amountInWords = words ? `${words} Pesos` : "";

  const [oathAge, setOathAge] = useState("");
  const [yearsInBarangay, setYearsInBarangay] = useState("");
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const isMinorIndigency = certType === "indigency_minor";
  const isLegalIndigency = certType === "indigency_legal_age";

  const isCustom = certType === "custom";

  const normalizedCertType = certType;

  const isResidency = certType === "residency";
  const isBarangayCertificates = certType === "barangay_certification";

  const selectedCert = CERTIFICATE_TYPES.find(
    (c) => c.value === normalizedCertType
  );

  const mainTitle = isCustom
    ? customCert
    : isMinorIndigency || isLegalIndigency
    ? "Certificate of Indigency"
    : selectedCert?.title || selectedCert?.label || "";

  {
    typeof mainTitle === "string" ? mainTitle.toUpperCase() : mainTitle;
  }

  const isCustomSubtitle = subtitleType === "custom";

  const finalSubtitle = isCustomSubtitle
    ? customSubtitle
    : CERTIFICATE_SUBTITLES.find((s) => s.value === subtitleType)?.label || "";

  const isBarangayIndigency = certType === "barangay_indigency";
  const isIndigency =
    certType === "indigency" ||
    certType === "indigency_minor" ||
    certType === "indigency_legal_age";

  useEffect(() => {
    console.log("certType:", certType);
  }, [certType]);

  const selectedResident = useMemo(
    () => residents.find((r) => String(r.id) === String(selectedResidentId)),
    [residents, selectedResidentId]
  );

  const selectedCerti = CERTIFICATE_TYPES.find((c) => c.value === certType);

  const qrValue = selectedResident
    ? `${window.location.origin}/?public=residentview&code=${encodeURIComponent(
        selectedResident.resident_code
      )}&types=${encodeURIComponent(
        selectedCerti.label
      )}&issued=${encodeURIComponent(issueDate)}`
    : "";

  console.log("Inserted Value in QR Code", qrValue);

  useEffect(() => {
    if (certType === "barangay_certificate") {
      setSubtitleType("ra_11261");
      setCustomSubtitle("");
    } else {
      setSubtitleType("");
      setCustomSubtitle("");
    }
  }, [certType]);

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    const { protocol, hostname } = window.location;

    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    const isSecure = protocol === "https:";

    // ❌ Browser rule — cannot bypass
    if (!isLocalhost && !isSecure) {
      showSnackbar(
        "Camera only works on localhost or HTTPS.\n\nUse image upload for LAN access.",
        "error"
      );
      return;
    }

    try {
      setCameraOpen(true);
      setCapturedImage(null);
      setPreviewMode(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      console.error(err);
      showSnackbar("Unable to access camera", "error");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    setCapturedImage(data);

    // Stop webcam
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    setPreviewMode(true); // Activate preview mode
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const retakePhoto = async () => {
    setPreviewMode(false);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showSnackbar("Unable to access camera");
      console.error(err);
    }
  };

  // ---- NEW: officials state comes BEFORE effects that use it
  const [officials, setOfficials] = useState([]);

  // Load residents
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await api.get("/residents");
        setResidents(res.data || []);
      } catch (err) {
        console.error("Error loading residents", err);
        setError("Failed to load residents.");
      }
    };
    loadResidents();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await api.get("/barangay-profile");
        if (res.data) {
          setBarangayName(res.data.barangay_name);
          setMunicipality(res.data.municipality);
          setProvince(res.data.province);
          setPlaceIssued(res.data.place_issued || "Barangay Hall");
        }
      } catch (err) {
        console.error("Error loading barangay profile", err);
        // optional: setError('Failed to load barangay profile.');
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Load officials
  useEffect(() => {
    const loadOfficials = async () => {
      try {
        const res = await api.get("/officials");
        setOfficials(res.data || []);
      } catch (err) {
        console.error("Error loading officials for certificates", err);
      }
    };
    loadOfficials();
  }, []);

  // When officials change, auto-set captain & secretary names
  // When officials change, auto-set captain & secretary names
  // When officials change, auto-set captain & secretary names
  useEffect(() => {
    if (!officials.length) return;

    const captain =
      officials.find((o) => o.is_captain === true || o.is_captain === 1) ||
      officials.find((o) => o.position === "Punong Barangay") ||
      null;

    const secretary =
      officials.find((o) => o.is_secretary === true || o.is_secretary === 1) ||
      null;

    if (captain) {
      setCaptainName(captain.full_name);
    }

    if (secretary) {
      setSecretaryName(secretary.full_name);
    } else {
      setSecretaryName("");
      console.warn("⚠️ No Barangay Secretary flagged (is_secretary)");
    }
  }, [officials]);

  useEffect(() => {
    setValidDate(addMonths(issueDate, 6));
  }, [issueDate]);

  const validDateToSeconds = (validDate) => {
    if (!validDate) return null;

    return Math.floor(new Date(validDate).getTime() / 1000);
  };

  const sendDocumentRequest = async () => {
    if (sendingRequest) return;
    try {
      setSendingRequest(true);

      const selectedCert = CERTIFICATE_TYPES.find((c) => c.value === certType);

      const payload = {
        resident_id: selectedResidentId,
        cert_type: selectedCert?.label,
        issued_at: issueDate,
        valid_until: validDateToSeconds(validDate),
      };

      await api.post("/document-request", payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingRequest(false);
    }
  };

  const buildFullName = (r) => {
    if (!r) return "";
    const parts = [
      r.first_name,
      r.middle_name ? `${r.middle_name.charAt(0)}.` : "",
      r.last_name,
      r.suffix || "",
    ].filter(Boolean);
    return parts.join(" ");
  };

  // Captain official object
  const captainOfficial = useMemo(() => {
    return (
      officials.find((o) => o.is_captain || o.position === "Punong Barangay") ||
      null
    );
  }, [officials]);

  // Secretary official object
  const secretaryOfficial = useMemo(() => {
    return (
      officials.find(
        (o) => o.is_secretary || o.position === "Barangay Secretary"
      ) || null
    );
  }, [officials]);

  // Build signature URLs
  const captainSignatureUrl = captainOfficial?.signature_path
    ? `${API_ROOT}${captainOfficial.signature_path.startsWith("/") ? "" : "/"}${
        captainOfficial.signature_path
      }`
    : null;

  const secretarySignatureUrl = secretaryOfficial?.signature_path
    ? `${API_ROOT}${
        secretaryOfficial.signature_path.startsWith("/") ? "" : "/"
      }${secretaryOfficial.signature_path}`
    : null;

  // Build safe image URL
  const captainProfileUrl = captainOfficial?.profile_img
    ? captainOfficial.profile_img.startsWith("http")
      ? captainOfficial.profile_img
      : `${API_ROOT}${captainOfficial.profile_img.startsWith("/") ? "" : "/"}${
          captainOfficial.profile_img
        }`
    : null;

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

  const printRef = useRef(null);
  const [canPrint, setCanPrint] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!selectedResidentId || !certType) {
        setCanPrint(false);
        setCheckingPermission(false);
        return;
      }

      try {
        // 🔓 ADMIN & SUPERADMIN ALWAYS ALLOWED
        if (["Admin", "SuperAdmin"].includes(myRole)) {
          setCanPrint(true);
          setCheckingPermission(false);
          return;
        }

        // 👤 USER → must be approved
        const res = await api.get(
          `/can-print/${selectedResidentId}/${certType}`
        );

        setCanPrint(res.data.allowed === true);
      } catch (err) {
        setCanPrint(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkPermission();
  }, [selectedResidentId, certType, myRole]);

  const handleInsertReceipt = async () => {
    try {
      await api.post("/insert-receipt", {
        resident_id: selectedResidentId,
        amount: amount,
        purpose: purpose,
        date: issueDate,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneratePdfSuperAdmin = async () => {
    await generatePdf();
  };

  const handleGeneratePdfUser = async () => {
    if (!canPrint) {
      alert("Your request is not approved or already expired.");
      return;
    }

    await generatePdf();
  };

  const generatePdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();

    /* ===== BARANGAY CERTIFICATE (2 PAGES) ===== */
    if (certType === "barangay_certificate") {
      if (!barangayCertRef.current || !oathRef.current) {
        alert("Certificate pages not ready");
        return;
      }

      const canvas1 = await html2canvas(barangayCertRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const img1 = canvas1.toDataURL("image/png");
      const img1Height = (canvas1.height * pdfWidth) / canvas1.width;
      pdf.addImage(img1, "PNG", 0, 0, pdfWidth, img1Height);

      pdf.addPage();

      const canvas2 = await html2canvas(oathRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const img2 = canvas2.toDataURL("image/png");
      const img2Height = (canvas2.height * pdfWidth) / canvas2.width;
      pdf.addImage(img2, "PNG", 0, 0, pdfWidth, img2Height);
    } else if (certType === "awknowledgement_receipt") {
      /* ===== ACKNOWLEDGEMENT RECEIPT (1 PAGE) ===== */
      if (!acknowledgementRef.current) {
        alert("Acknowledgement Receipt page not ready");
        return;
      }

      const canvas = await html2canvas(acknowledgementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const img = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, imgHeight);

      await handleInsertReceipt();
    } else {
      /* ===== OTHER CERTIFICATES (1 PAGE) ===== */
      if (!previewRef.current) {
        alert("Certificate page not ready");
        return;
      }

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const img = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, imgHeight);
    }

    pdf.save(`${certType}.pdf`);

    await sendDocumentRequest();
    await AuditMyAction(
      "Exported a pdf file of a certificate/document in Certificate Page"
    );
  };

  const handleGenerateReport = async () => {
    try {
      // 1️⃣ Fetch filtered receipt data from backend
      const res = await api.post("/get-data-receipt", {
        month: selectedMonth,
        year: selectedYear,
      });

      const data = res.data.data || [];

      if (data.length === 0) {
        alert("No records found for the selected period.");
        return;
      }

      // 2️⃣ Prepare rows for Excel
      let totalAmount = 0;

      const rows = data.map((row, index) => {
        const amount = Number(row.amount) || 0;
        totalAmount += amount;

        return {
          ID: index + 1,
          "Receipt ID": row.receipt_id,
          "Full Name": `${row.first_name} ${row.last_name}`,
          Purpose: row.purpose,
          Amount: amount,
        };
      });

      // 3️⃣ Append total row
      rows.push({});
      rows.push({
        Purpose: "TOTAL",
        Amount: totalAmount,
      });

      // 4️⃣ Create worksheet & workbook
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Auto column width
      worksheet["!cols"] = [
        { wch: 6 }, // ID
        { wch: 15 }, // Receipt ID
        { wch: 25 }, // Full Name
        { wch: 20 }, // Purpose
        { wch: 15 }, // Amount
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // 5️⃣ Filename logic (Monthly / Yearly)
      let filename = "";

      if (selectedMonth === "all") {
        filename = `${selectedYear}_Report.xlsx`;
      } else {
        const monthName = new Date(
          `${selectedYear}-${selectedMonth}-01`
        ).toLocaleString("en-US", { month: "long" });

        filename = `${monthName}_Report.xlsx`;
      }

      // 6️⃣ Generate & download Excel
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, filename);
    } catch (err) {
      console.error("Generate report error:", err);
      alert("Failed to generate report.");
    }
  };

  useEffect(() => {
    if (selectedResident) {
      setResidentAddress(selectedResident.address || "");
    } else {
      setResidentAddress("");
    }
  }, [selectedResident]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const [editorOpen, setEditorOpen] = useState(false);

  const formatIssuedDateHTML = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const day = d.getDate();

    const ordinal =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();

    return `
    ${day}<sup style="font-size:0.6em; vertical-align:super;">${ordinal}</sup>
    day of ${month}, ${year}
  `;
  };

  const formatIssueDate = (issueDate) => {
    if (!issueDate) return "";

    const d = new Date(issueDate);
    const day = d.getDate();

    const ordinal =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();

    return `${day}<sup>${ordinal}</sup> day of ${month}, ${year}`;
  };

  const [certificateBody, setCertificateBody] = useState("");
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const [requestStatus, setRequestStatus] = useState(null);

  const [selectedCertificateType, setSelectedCertificateType] = useState("");

  const requestCertificate = async () => {
    try {
      if (!selectedResidentId) {
        showSnackbar("Please select a resident first");
        return;
      }

      if (!certType) {
        showSnackbar("Please select a certificate type");
        return;
      }

      // Optional: label for admin UI (NOT sent to backend)
      let requestTypeLabel = CERTIFICATE_TYPES.find(
        (c) => c.value === certType
      )?.label;

      if (subtitleType) {
        const subtitleLabel = CERTIFICATE_SUBTITLES.find(
          (s) => s.value === subtitleType
        )?.label;
        requestTypeLabel += ` ${subtitleLabel}`;
      }

      if (certType === "custom" && customCertificateName) {
        requestTypeLabel = customCertificateName;
      }

      // ✅ BACKEND NEEDS ONLY THIS
      await api.post("/print-requests", {
        resident_id: selectedResidentId,
        request_type: certType,
      });

      showSnackbar("Certificate request submitted. Waiting for approval.");
      setRequestStatus("pending");
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Failed to submit request");
    }
  };

  const generateDefaultCertificateBody = () => {
    return `
    <p style="margin-bottom:16px;font-size:21px;">
      To Whom It May Concern:
    </p>

    <p style="text-align:justify;margin-bottom:16px;font-size:21px;text-indent:45px;">
      This is to certify that
      <b><u>${
        buildFullName(selectedResident)?.toUpperCase() || "FULL NAME"
      }</u></b>,
      of legal age, is a bona fide resident of this Barangay with an actual residential
      address located at
      <b><u>${residentAddress || "ADDRESS"}</u></b>,
      is known to be an indigent member of this Barangay.
    </p>

    <p style="text-align:justify;margin-bottom:16px;font-size:21px;text-indent:45px;">
      The aforementioned person requested this certificate in order to fulfill his/her
      need for
      <b><u>${purpose || "PURPOSE"}</u></b>.
    </p>

    <p style="text-align:justify;margin-bottom:16px;font-size:21px;text-indent:45px;">
      Issued this
      <b><u>${formatIssuedDateHTML(issueDate)}</u></b>
      at ${barangayName}, ${municipality}, ${province}.
    </p>
  `;
  };

  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      const res = await api.get("/certificate-templates/INDIGENCY");

      console.log("TEMPLATE:", res.data);

      setTemplateId(res.data.template_id);
      setCertificateBody(res.data.body_html);

      setIsManuallyEdited(false); // 🔥 IMPORTANT
    };

    loadTemplate();
  }, []);

  useEffect(() => {
    // if template exists → NEVER overwrite
    if (templateId) return;

    // if user already edited → NEVER overwrite
    if (isManuallyEdited) return;

    setCertificateBody(generateDefaultCertificateBody());
  }, [
    selectedResident,
    residentAddress,
    purpose,
    issueDate,
    barangayName,
    municipality,
    province,
    templateId,
    isManuallyEdited,
  ]);

  const openEditor = () => {
    setIsManuallyEdited(true);
    setEditorOpen(true);
  };

  const saveTemplate = async () => {
    if (!templateId) {
      console.error("No templateId, cannot save");
      return;
    }

    try {
      console.log("SAVING TEMPLATE HTML:", certificateBody);

      await api.put(`/certificate-templates/${templateId}`, {
        body_html: certificateBody,
      });

      setIsManuallyEdited(false); // 🔥 lock regeneration
      setEditorOpen(false); // close dialog

      console.log("Template saved successfully");
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save template");
    }
  };

  const getFullName = () => {
    if (!selectedResident) return "";

    const { first_name, middle_name, last_name } = selectedResident;

    return [first_name, middle_name, last_name].filter(Boolean).join(" ");
  };

  const renderCertificateBody = () => {
    if (!certificateBody) return "";

    return certificateBody
      .replace(/{{FULL_NAME}}/g, getFullName())
      .replace(/{{ADDRESS}}/g, residentAddress || "")
      .replace(/{{PURPOSE}}/g, purpose || "")
      .replace(/{{ISSUE_DATE}}/g, formatIssueDate(issueDate))
      .replace(/{{BARANGAY}}/g, barangayName || "")
      .replace(/{{MUNICIPALITY}}/g, municipality || "")
      .replace(/{{PROVINCE}}/g, province || "");
  };

  // useEffect(() => {
  //   const blockContext = (e) => e.preventDefault();
  //   const blockKeys = (e) => {
  //     if (
  //       e.key === 'F12' ||
  //       (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) ||
  //       (e.ctrlKey && ['u', 'p'].includes(e.key.toLowerCase()))
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener('contextmenu', blockContext);
  //   document.addEventListener('keydown', blockKeys);

  //   return () => {
  //     document.removeEventListener('contextmenu', blockContext);
  //     document.removeEventListener('keydown', blockKeys);
  //   };
  // }, []);

  const cameraModal = (
    <Modal
      open={cameraOpen}
      onClose={() => {
        stopCamera();
        setCameraOpen(false);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          width: 650,
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={() => {
            stopCamera();
            setCameraOpen(false);
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: "50%", // ✅ circle
            backgroundColor: "#000000",
            color: "white",
            "&:hover": {
              backgroundColor: "#000000",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {previewMode ? "Captured Photo" : "Camera Preview"}
        </Typography>

        {/* If NOT yet captured → show video */}
        {!previewMode && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              borderRadius: "10px",
              backgroundColor: "black",
            }}
          />
        )}

        {/* If already captured → show captured image */}
        {previewMode && capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        {/* Buttons */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          {!previewMode ? (
            <Button variant="contained" onClick={capturePhoto}>
              Capture Photo
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ backgroundColor: "#800000", color: "white" }}
                onClick={retakePhoto}
              >
                Retake Photo
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setPreviewMode(false);
                  setCameraOpen(false);
                }}
              >
                Use Photo
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );

  return (
    <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontFamily: "times new roman",
            fontSize: "36px",
          }}
        >
          BARANGAY CERTIFICATE
        </Typography>
      </Box>

      <style>
        {`
/* =========================
   SCREEN (normal view)
   ========================= */
@media screen {
  /* keep print layouts hidden on screen */
  .print-only,
  .print-only * {
    visibility: hidden;
  }
}

/* =========================
   PRINT
   ========================= */
@media print {
  /* hide everything first */
  body * {
    visibility: hidden !important;
  }

  /* base print container (hidden by default) */
  .print-only {
    visibility: hidden !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
       transform: scale(0.96); 
  }

  /* show ONLY the active print mode */
  .print-only.active-print,
  .print-only.active-print * {
    visibility: visible !important;
  }

  /* hide buttons, nav, etc */
  .hide-on-print {
    display: none !important;
  }

  /* page handling */
  .page-break {
    break-after: page;
    page-break-after: always;
  }

  .print-page {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* print margins */
  @page {
    margin: 3mm;
  }
}
`}
      </style>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      {cameraModal}

      {/* LEFT COLUMN */}
      <Grid item xs={12} md={6}>
        <TableContainer
          component={Paper}
          sx={{
            width: "99%",

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
                    border: "3px solid black",
                  }}
                >
                  Resident & Certificate Details
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <Card
          sx={{
            p: 3,
            mb: 5,
            mt: -0.5,
            border: "2px solid black",
            width: "99%",
          }}
          elevation={3}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                sx={{ width: "300px", height: "55px", mb: 2 }}
                label="Certificate Type"
                value={certType}
                onChange={(e) => {
                  const value = e.target.value;
                  setCertType(value);

                  if (value === "barangay_certificate") {
                    setSubtitleType("ra_11261");
                    setCustomSubtitle("");
                  } else {
                    setSubtitleType("");
                    setCustomSubtitle("");
                  }

                  if (value !== "custom") {
                    setCustomCert("");
                  }
                }}
                fullWidth
              >
                {CERTIFICATE_TYPES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.dropdownLabel || c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={residents}
                getOptionLabel={(r) =>
                  `${r.last_name}, ${r.first_name} ${r.middle_name || ""}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  residents.find(
                    (r) => String(r.id) === String(selectedResidentId)
                  ) || null
                }
                onChange={(event, newValue) => {
                  setSelectedResidentId(newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Resident"
                    required
                    fullWidth
                  />
                )}
                sx={{ width: "223px", height: "55px" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                value={residentAddress}
                sx={{ width: "223px", height: "55px" }}
                onChange={(e) => setResidentAddress(e.target.value)}
                fullWidth
              />
            </Grid>

            {certType === "custom" && (
              <>
                {/* MAIN TITLE */}
                <Grid item xs={12}>
                  <TextField
                    label="Specify Certificate (Main Title)"
                    placeholder="e.g. First Time Jobseekers Assistance"
                    value={customCert}
                    onChange={(e) => setCustomCert(e.target.value)}
                    size="small"
                    required
                    sx={{
                      width: "223px",

                      "& .MuiInputBase-root": {
                        height: "57px",
                        display: "flex",
                        alignItems: "center",
                      },

                      "& .MuiInputBase-input": {
                        padding: "0 14px",
                        height: "100%",
                        boxSizing: "border-box",
                      },

                      "& .MuiInputLabel-root": {
                        top: "50%",
                        transform: "translate(14px, -50%) scale(1)",
                      },

                      "& .MuiInputLabel-shrink": {
                        top: 0,
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  />
                </Grid>

                {/* SUBTITLE DROPDOWN */}
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Subtitle"
                    value={subtitleType}
                    onChange={(e) => setSubtitleType(e.target.value)}
                    sx={{
                      width: "223px",

                      "& .MuiOutlinedInput-root": {
                        height: "57px",
                      },

                      /* 🔥 THIS is the displayed select value */
                      "& .MuiSelect-select": {
                        height: "57px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        boxSizing: "border-box",
                      },

                      /* Label alignment */
                      "& .MuiInputLabel-root": {
                        top: "50%",
                        transform: "translate(14px, -50%) scale(1)",
                      },

                      "& .MuiInputLabel-shrink": {
                        top: 0,
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    {CERTIFICATE_SUBTITLES.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* SPECIFY SUBTITLE (ONLY IF OTHER) */}
                {subtitleType === "custom" && (
                  <Grid item xs={12}>
                    <TextField
                      label="Specify Subtitle"
                      placeholder="e.g. First Time Jobseekers Assistance Act – RA 11261"
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      size="small"
                      sx={{
                        width: "223px",

                        "& .MuiInputBase-root": {
                          height: "57px",
                          display: "flex",
                          alignItems: "center",
                        },

                        "& .MuiInputBase-input": {
                          padding: "0 14px",
                          height: "100%",
                          boxSizing: "border-box",
                        },

                        "& .MuiInputLabel-root": {
                          top: "50%",
                          transform: "translate(14px, -50%) scale(1)",
                        },

                        "& .MuiInputLabel-shrink": {
                          top: 0,
                          transform: "translate(14px, -6px) scale(0.75)",
                        },
                      }}
                    />
                  </Grid>
                )}
              </>
            )}

            {isBarangayCertificate && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Age"
                  type="number"
                  sx={{ width: "223px", height: "55px" }}
                  value={oathAge}
                  onChange={(e) => setOathAge(e.target.value)}
                  fullWidth
                  inputProps={{ min: 1 }}
                />

                <TextField
                  label="Years of Residency in Barangay"
                  type="text"
                  value={yearsInBarangay}
                  sx={{ width: "223px", height: "55px" }}
                  onChange={(e) => setYearsInBarangay(e.target.value)}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Box>
            )}

            <Grid item xs={12}>
              <TextField
                label="Purpose"
                placeholder="e.g., employment, scholarship, school requirement"
                value={purpose}
                sx={{ width: "223px", height: "55px" }}
                onChange={(e) => setPurpose(e.target.value)}
                fullWidth
              />
            </Grid>

            {certType === "awknowledgement_receipt" && (
              <Grid item xs={12}>
                <TextField
                  label="Amount (₱)"
                  placeholder="50, 150, 250..."
                  value={amount}
                  sx={{ width: "223px", height: "55px" }}
                  fullWidth
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setAmount(value);
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                label="Issue Date"
                type="date"
                sx={{ width: "223px", height: "55px" }}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Valid Until"
                type="date"
                sx={{ width: "223px", height: "55px" }}
                value={validDate}
                onChange={(e) => setValidDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* <Grid item xs={12} md={6}>
              <TextField
                label="Place of Issuance"
                value={placeIssued}
                onChange={(e) => setPlaceIssued(e.target.value)}
                fullWidth
              />
            </Grid> */}

            {certType === "business_permit" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Business Address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Nature of Business"
                    value={businessNature}
                    onChange={(e) => setBusinessNature(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}

            {isMinorIndigency && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Born On"
                    placeholder="e.g. January 15, 2010"
                    value={bornOn}
                    sx={{ width: "223px", height: "55px" }}
                    onChange={(e) => setBornOn(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Residing At"
                    placeholder={
                      selectedResident?.address || "Complete Address"
                    }
                    sx={{ width: "223px", height: "55px" }}
                    value={minorAddress}
                    onChange={(e) => setMinorAddress(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Parent/s Name"
                    placeholder="e.g. Juan Dela Cruz & Maria Dela Cruz"
                    value={parentsName}
                    sx={{ width: "223px", height: "55px" }}
                    onChange={(e) => setParentsName(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Registered Voter Of"
                    placeholder={
                      selectedResident?.address || "Barangay Address"
                    }
                    value={parentsVoterAddress}
                    sx={{ width: "223px", height: "55px" }}
                    onChange={(e) => setParentsVoterAddress(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Catholic Institution / School"
                    placeholder="e.g. Espiritu Santo Parochial School"
                    value={schoolName}
                    sx={{ width: "223px", height: "55px" }}
                    onChange={(e) => setSchoolName(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {/* <Grid item xs={12} md={4}>
                  <TextField
                    label="OR Number"
                    value={orNumber}
                    onChange={(e) => setOrNumber(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Amount (₱)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                  />
                </Grid> */}

            <Grid item xs={12} md={4}>
              {/* Laptop Camera */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<PhotoCameraIcon />}
                sx={{ height: "56px", width: "223px", mr: 1 }}
                onClick={openCamera}
              >
                Take Photo (Laptop)
              </Button>

              {/* Phone Camera */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<SmartphoneIcon />}
                sx={{ height: "56px", width: "223px", textAlign: "center" }}
                component="label"
              >
                Select Photo from Album
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      setCapturedImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </Card>

        <TableContainer
          component={Paper}
          sx={{
            width: "99%",

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
                    border: "3px solid black",
                  }}
                >
                  Barangay Header & Officials
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <Card
          sx={{ p: 3, border: "2px solid black", width: "99%", mt: -0.5 }}
          elevation={3}
        >
          <Card sx={{ p: 3 }}>
            {/* ================= FORM CONTENT ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Barangay Name"
                  value={barangayName}
                  onChange={(e) => setBarangayName(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Municipality / City"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Punong Barangay"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Barangay Secretary"
                  value={secretaryName}
                  onChange={(e) => setSecretaryName(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* ================= FOOTER ACTIONS ================= */}
            <Grid
              container
              spacing={2}
              sx={{ mt: 4 }}
              justifyContent="space-between"
              alignItems="center"
            >
              {/* LEFT CORNER */}
              <Grid item>
                {/* USER */}
                {myRole === "User" && (
                  <>
                    {checkingPermission ? (
                      <Button
                        variant="contained"
                        sx={{ ml: 2, height: "56px", width: "223px" }}
                        disabled
                      >
                        Checking permission...
                      </Button>
                    ) : !canPrint ? (
                      <Button
                        variant="contained"
                        sx={{ ml: 2, height: "56px", width: "223px" }}
                        onClick={requestCertificate}
                      >
                        Request Certificate
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          ml: 2,
                          height: "56px",
                          width: "223px",
                          backgroundColor: "green",
                          color: "white",
                        }}
                        onClick={handleGeneratePdfUser}
                      >
                        Generate PDF
                      </Button>
                    )}
                  </>
                )}
                {/* ADMIN & SUPERADMIN */}
                {["Admin", "SuperAdmin"].includes(myRole) && (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      ml: 2,
                      height: "56px",
                      width: "223px",
                      backgroundColor: "green",
                      color: "white",
                    }}
                    onClick={handleGeneratePdfSuperAdmin}
                  >
                    {certType === "awknowledgement_receipt"
                      ? "Generate Receipt"
                      : "Generate PDF"}
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{ ml: 2, height: "56px", width: "223px" }}
                  onClick={openEditor}
                >
                  Edit Certificate Content
                </Button>
                {isAcknowledgementReceipt && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <TextField
                      select
                      label="Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      sx={{ width: 223, ml: 2 }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m, i) => (
                        <MenuItem
                          key={i}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      sx={{ width: 223, ml: 2 }}
                    >
                      {Array.from(
                        { length: 10 },
                        (_, i) => currentYear - i
                      ).map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      sx={{ ml: 2, height: "56px", width: "223px" }}
                      onClick={handleGenerateReport}
                    >
                      Generate Report
                    </Button>
                  </Box>
                )}
              </Grid>

              {/* RIGHT CORNER */}
              <Grid item>
                <Button
                  variant="contained"
                  className="hide-on-print"
                  sx={{ mr: 2, height: "56px", width: "223px" }}
                  onClick={() => {
                    setPrintMode("certificate_form");
                    setTimeout(() => window.print(), 100);
                  }}
                >
                  Print Certificate Form
                </Button>

                <Button
                  variant="contained"
                  className="hide-on-print"
                  sx={{ height: "56px", width: "223px" }}
                  onClick={() => {
                    setPrintMode("jobseeker");
                    setTimeout(() => window.print(), 100);
                  }}
                >
                  Print Jobseeker
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Card>
      </Grid>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Right side: preview */}
      <Grid item xs={12} md={6}>
        {!isBarangayCertificate && !isAcknowledgementReceipt && (
          <Paper
            ref={previewRef}
            className="hide-border-on-print"
            sx={{
              p: 3,
              minHeight: 400,
              maxWidth: "1200px",
              ml: 25,
              mt: 5,
              border: "2px solid black", // screen only
            }}
            elevation={2}
          >
            {/* content */}

            {/* ---- HEADER LOGOS ---- */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "150px",
              }}
            >
              {settings.logo_url && (
                <img
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Logo"
                  style={{
                    width: 160,
                    height: 160,
                    marginBottom: "-250px",
                    marginLeft: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <img
                src={LungsodngManila}
                alt="Manila Seal"
                style={{ width: 140, height: 140, marginBottom: "-140px" }}
              />

              <img
                src={BagongPilipinas}
                alt="Bagong Pilipinas"
                style={{
                  width: 180,
                  height: 160,
                  marginBottom: "-250px",
                  marginRight: "50px",
                }}
              />
            </Box>

            {/* ---- TEXT HEADER ---- */}
            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                mt: -2,
              }}
            >
              Republika ng Pilipinas
            </Typography>

            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                mt: -2,
              }}
            >
              Lungsod ng Maynila
            </Typography>

            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                fontWeight: "bold",
                letterSpacing: 3,
                color: "red",
                mt: -2,
              }}
            >
              {settings?.address || "Company Address"}
            </Typography>

            <Typography
              align="center"
              sx={{ fontSize: "18px", mt: -1, fontFamily: "Times New Roman" }}
            >
              Email address:{" "}
              <span style={{ color: "blue" }}>
                <u>barangay369zone37@gmail.com</u>
              </span>
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                py: 1,

                fontFamily: "Arial",
              }}
            >
              {/* Phone */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: -1 }}
              >
                <PhoneIcon sx={{ color: "#1b3a8a", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  (02) 87318622
                </Typography>
              </Box>

              {/* Facebook */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: -2 }}
              >
                <FacebookIcon sx={{ color: "#1877F2", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  Brgy Threesixnine
                </Typography>
              </Box>
            </Box>

            {/* ---- BLUE BAR ---- */}
            <Box
              sx={{
                backgroundColor: "#1b3a8a",
                color: "white",
                height: "35px",
                width: "92%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 5.5,
                fontFamily: "Cambria",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              OFFICE OF THE BARANGAY CHAIRMAN
            </Box>

            <Box
              sx={{
                position: "relative",
                p: 2,
              }}
            >
              {settings.logo_url && (
                <Box
                  component="img"
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Watermark"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "80%",
                    height: "90%",
                    borderRadius: "50%",
                    opacity: 0.15,
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                  }}
                />
              )}

              <Box sx={{ position: "relative", zIndex: 10, display: "flex" }}>
                {/* LEFT SIDE PANEL */}
                <Box
                  sx={{
                    width: "30%",
                    border: "3px solid #ADD8E6", // light blue
                    ml: 3.5,
                    p: 2,
                    mr: 1,
                    mt: 1,
                    backgroundColor: "transparent",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "red",
                      mb: 5,
                      fontFamily: "Cooper Black",
                      fontSize: "24px",
                    }}
                  >
                    SANGGUNIANG <br />
                    BARANGAY
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#003366",
                      fontSize: "16px",
                      textAlign: "center",
                      textDecoration: "underline",
                    }}
                  >
                    {officials.find((o) => o.is_captain)?.full_name || ""}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "15px",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      fontWeight: "bold",
                      color: "navy",
                      fontFamily: "Times new roman",
                      textAlign: "center",
                    }}
                  >
                    {captainName}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "red",
                      mb: 2,
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      fontSize: "16px",
                    }}
                  >
                    PUNONG BARANGAY
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      sx={{
                        border: "8px solid black",
                        p: "3px",
                      }}
                    >
                      <Box
                        sx={{
                          width: 200,
                          height: 250,
                          border: "5px solid black",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "transparent",
                        }}
                      >
                        {captainProfileUrl ? (
                          <img
                            src={captainProfileUrl}
                            alt="Captain Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="gray">
                            No Profile
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Sangguniang Barangay Title */}
                  {/* Chairman Section */}

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "red",
                      mt: 2,
                      mb: 1,
                      textAlign: "center",
                      fontFamily: "Times new roman",
                    }}
                  >
                    BARANGAY KAGAWAD
                  </Typography>

                  {officials
                    .filter((o) => o.position === "Barangay Kagawad")
                    .map((o) => (
                      <Typography
                        key={o.id}
                        sx={{
                          fontSize: "16px",
                          mb: 1,
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}

                  {officials
                    .filter(
                      (o) => o.position === "Sangguniang Kabataan Chairperson"
                    )
                    .map((o) => (
                      <Typography
                        key={o.id}
                        sx={{
                          mt: 4,
                          textDecoration: "underline",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    SK CHAIRMAN
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "navy",
                      fontFamily: "Times new roman",
                      textAlign: "center",
                    }}
                  >
                    {officials.find((o) => o.is_secretary)?.full_name ||
                      "SECRETARY NAME"}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    SECRETARY
                  </Typography>

                  {/* Barangay Kagawad */}

                  {/* Treasurer */}

                  {officials
                    .filter((o) => o.position === "Barangay Treasurer")
                    .map((o) => (
                      <Typography
                        key={o.id} // ✅ REQUIRED
                        sx={{
                          mt: 1,
                          textDecoration: "underline",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    TREASURER
                  </Typography>
                </Box>

                {/* RIGHT SIDE CONTENT (Certificate Body) */}
                <Box sx={{ width: "72%", pr: 2, mr: 4 }}>
                  {/* MAIN TITLE */}
                  {/* MAIN TITLE (CUSTOMIZABLE) */}
                  <Typography
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "36px",
                      color: "navy",
                      letterSpacing: "3px",
                      mt: 1,
                      fontFamily: "Stencil",
                    }}
                  >
                    {typeof mainTitle === "string"
                      ? mainTitle.toUpperCase()
                      : mainTitle}
                  </Typography>

                  {/* SUBTITLE (OPTIONAL) */}
                  {finalSubtitle && (
                    <Typography
                      align="center"
                      sx={{
                        fontSize: "21px",
                        fontStyle: "italic",
                        mt: "-4px",
                        color: "#000",
                        fontFamily: "Times New Roman",
                      }}
                    >
                      {finalSubtitle}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      mt: 2,
                      fontSize: "21px",
                      fontFamily: "Times New Roman",
                      lineHeight: 1.7,
                      marginLeft: 6,
                    }}
                  >
                    {certType === "business_permit" ? (
                      <>
                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This is to certify that the undersigned hereby
                          approved the herein application of the owner,
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {buildFullName(selectedResident)?.toUpperCase()}
                          </span>
                          , for a Barangay Business Permit to operate a{" "}
                          <span>{businessNature || ""}</span> of
                        </p>

                        <Box sx={{ textAlign: "center", mt: 1 }}>
                          {/* --- Business Name --- */}
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "21px",
                              fontFamily: "Times New Roman",
                              mt: 2,
                              textDecoration: "underline",
                            }}
                          >
                            {businessName || "__________________________"}
                          </Typography>

                          <Typography
                            sx={{
                              fontStyle: "italic",
                              fontSize: "18px",
                              fontFamily: "Times New Roman",
                              mt: 1,
                            }}
                          >
                            (Business Name)
                          </Typography>

                          <Typography sx={{ mt: 2 }}>located at</Typography>

                          {/* --- Business Address --- */}
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "21px",
                              fontFamily: "Times New Roman",
                              mt: 2,
                              textDecoration: "underline",
                            }}
                          >
                            {businessAddress || "__________________________"}
                          </Typography>

                          <Typography
                            sx={{
                              fontStyle: "italic",
                              fontSize: "18px",
                              fontFamily: "Times New Roman",
                              mt: 1,
                            }}
                          >
                            (Business Address)
                          </Typography>
                        </Box>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginTop: "16px",
                          }}
                        >
                          This certifies that the applicant pledges to abide
                          with laws, rules and regulations regarding the said
                          activity and the same is not puissance to public order
                          and safety.
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            marginBottom: "16px",
                            fontSize: "21px",
                            textIndent: "45px",
                          }}
                        >
                          The aforementioned person requested this certification
                          in order to fulfill his/her need for
                          <span
                            style={{
                              textDecoration: "underline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            {purpose || ""}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            marginBottom: "16px",
                            fontSize: "21px",
                            textIndent: "45px",
                          }}
                        >
                          Issued this
                          <span
                            style={{
                              textDecoration: "underline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            {(() => {
                              const d = new Date(issueDate);
                              const day = d.getDate();
                              const ordinal =
                                day % 10 === 1 && day !== 11
                                  ? "st"
                                  : day % 10 === 2 && day !== 12
                                  ? "nd"
                                  : day % 10 === 3 && day !== 13
                                  ? "rd"
                                  : "th";
                              const month = d.toLocaleString("en-US", {
                                month: "long",
                              });
                              const year = d.getFullYear();
                              return (
                                <>
                                  {day}
                                  <sup
                                    style={{
                                      fontSize: "0.6em",
                                      verticalAlign: "super",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {ordinal}
                                  </sup>{" "}
                                  day of {month}, {year}
                                </>
                              );
                            })()}
                          </span>{" "}
                          at {barangayName}, {municipality}, {province}.
                        </p>
                      </>
                    ) : isResidency ? (
                      <>
                        <p style={{ marginBottom: "16px", fontSize: "21px" }}>
                          To Whom It May Concern:
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This is to certify that
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {buildFullName(selectedResident)?.toUpperCase()}
                          </span>
                          , of legal age, is a bona fide resident of this
                          Barangay, with an actual postal address located at
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {selectedResident?.address}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This further certifies that he/she is known to be a
                          person of good moral character, a law-abiding citizen,
                          and has no derogatory or criminal records filed in
                          this barangay.
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          The aforementioned person requested this certificate
                          in order to fulfill his/her need for
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {purpose || ""}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                          }}
                        >
                          Issued this
                          <span
                            style={{
                              textDecoration: "underline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            {(() => {
                              const d = new Date(issueDate);
                              const day = d.getDate();
                              const ordinal =
                                day % 10 === 1 && day !== 11
                                  ? "st"
                                  : day % 10 === 2 && day !== 12
                                  ? "nd"
                                  : day % 10 === 3 && day !== 13
                                  ? "rd"
                                  : "th";
                              const month = d.toLocaleString("en-US", {
                                month: "long",
                              });
                              const year = d.getFullYear();
                              return (
                                <>
                                  {day}
                                  <sup
                                    style={{
                                      fontSize: "0.6em",
                                      verticalAlign: "super",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {ordinal}
                                  </sup>{" "}
                                  day of {month}, {year}
                                </>
                              );
                            })()}
                          </span>{" "}
                          at the office of {barangayName}, {municipality},{" "}
                          {province}.
                        </p>
                      </>
                    ) : isBarangayCertificates ? (
                      <>
                        <p style={{ marginBottom: "16px", fontSize: "21px" }}>
                          To Whom It May Concern:
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This is to certify that
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {buildFullName(selectedResident)?.toUpperCase()}
                          </span>
                          , of legal age, is a bona fide resident of this
                          Barangay, with an actual postal address located at
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {selectedResident?.address}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          The aforementioned person requested this certificate
                          in order to fulfill his/her need for
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {purpose || ""}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                          }}
                        >
                          Issued this
                          <span
                            style={{
                              textDecoration: "underline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            {(() => {
                              const d = new Date(issueDate);
                              const day = d.getDate();
                              const ordinal =
                                day % 10 === 1 && day !== 11
                                  ? "st"
                                  : day % 10 === 2 && day !== 12
                                  ? "nd"
                                  : day % 10 === 3 && day !== 13
                                  ? "rd"
                                  : "th";
                              const month = d.toLocaleString("en-US", {
                                month: "long",
                              });
                              const year = d.getFullYear();
                              return (
                                <>
                                  {day}
                                  <sup
                                    style={{
                                      fontSize: "0.6em",
                                      verticalAlign: "super",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {ordinal}
                                  </sup>{" "}
                                  day of {month}, {year}
                                </>
                              );
                            })()}
                          </span>{" "}
                          at the office of {barangayName}, {municipality},{" "}
                          {province}.
                        </p>
                      </>
                    ) : isMinorIndigency ? (
                      <>
                        <p style={{ marginBottom: "16px", fontSize: "21px" }}>
                          To Whom It May Concern:
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This is to certify that
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {buildFullName(selectedResident)?.toUpperCase()}
                          </span>
                          , born on
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {bornOn || ""}
                          </span>
                          , residing at
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {minorAddress || ""}
                          </span>
                          , is known to be a person of good moral character and
                          has no criminal record nor derogatory information
                          against him. He maintains a good reputation in the
                          community.
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          His parent/s,
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {parentsName || ""}
                          </span>
                          , are registered voters of
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {parentsVoterAddress || ""}
                          </span>
                          . His family desires to send him to a Catholic
                          institution like
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {schoolName || ""}.
                          </span>
                          but is facing financial challenges. Their family is
                          one of the registered indigents in the community as
                          certified by the Punong Barangay.
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                            marginBottom: "16px",
                          }}
                        >
                          This certification is being issued upon the request of
                          the above-mentioned name to avail the scholarship
                          grant for Senior High School at
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            {purpose || ""}
                          </span>
                          .
                        </p>

                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "21px",
                            textIndent: "45px",
                          }}
                        >
                          Issued this
                          <span
                            style={{
                              textDecoration: "underline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            {(() => {
                              const d = new Date(issueDate);
                              const day = d.getDate();
                              const ordinal =
                                day % 10 === 1 && day !== 11
                                  ? "st"
                                  : day % 10 === 2 && day !== 12
                                  ? "nd"
                                  : day % 10 === 3 && day !== 13
                                  ? "rd"
                                  : "th";
                              const month = d.toLocaleString("en-US", {
                                month: "long",
                              });
                              const year = d.getFullYear();
                              return (
                                <>
                                  {day}
                                  <sup
                                    style={{
                                      fontSize: "0.6em",
                                      verticalAlign: "super",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {ordinal}
                                  </sup>{" "}
                                  day of {month}, {year}
                                </>
                              );
                            })()}
                          </span>{" "}
                          at the office of {barangayName}, {municipality},{" "}
                          {province}.
                        </p>
                      </>
                    ) : (
                      <Box
                        ref={printRef}
                        sx={{
                          fontSize: "21px",
                          fontFamily: "Times New Roman",
                          lineHeight: 1.7,
                          width: "100%", // 🔥 PAPER-LIKE MARGINS

                          // 🔥 paragraph formatting
                          "& p": {
                            textAlign: "justify",
                            textIndent: "1.25cm",
                            marginBottom: "16px",
                          },

                          // 🔥 first paragraph (To Whom It May Concern)
                          "& p:first-of-type": {
                            textIndent: 0,
                            marginBottom: "24px",
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: renderCertificateBody(),
                        }}
                      />
                    )}
                  </Box>

                  {/* SIGNATURES SECTION */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: isResidency
                        ? "flex-end"
                        : "space-between",
                      width: "100%",
                      mt: 3,
                      px: 2,
                    }}
                  >
                    {/* --- Prepared By (Left Side) --- */}
                    {!isResidency && (
                      <Box sx={{ textAlign: "center", marginLeft: 1 }}>
                        <Typography
                          sx={{
                            textAlign: "left",
                            marginTop: "150px",
                            mb: 2,
                            fontFamily: "Times new roman",
                            fontSize: "21px",
                          }}
                        >
                          Prepared by:
                        </Typography>

                        {secretarySignatureUrl && (
                          <img
                            src={secretarySignatureUrl}
                            alt="Secretary Signature"
                            style={{
                              width: 250,
                              height: 100,
                              objectFit: "contain",
                              marginBottom: "-50px",
                              marginTop: "-50px",
                            }}
                          />
                        )}

                        <div>________________________________</div>

                        <Typography
                          sx={{
                            fontFamily: "Times New Roman",
                            fontWeight: "bold",
                            fontSize: "21px",
                          }}
                        >
                          {secretaryName}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: "Times new roman",
                            fontSize: "21px",
                          }}
                        >
                          Barangay Secretary
                        </Typography>
                      </Box>
                    )}

                    {/* --- Certified By (Right Side) --- */}
                    <Box sx={{ textAlign: "center", marginLeft: -4 }}>
                      <Typography
                        sx={{
                          textAlign: "left",
                          marginTop: isResidency ? "25px" : "50px",
                          mb: 2,
                          fontFamily: "Times new roman",
                          fontSize: "21px",
                        }}
                      >
                        Certified by:
                      </Typography>

                      {captainSignatureUrl && (
                        <img
                          src={captainSignatureUrl}
                          alt="Captain Signature"
                          style={{
                            width: 250,
                            height: 100,
                            objectFit: "contain",
                            marginBottom: "-50px",
                            marginTop: "-50px",
                          }}
                        />
                      )}

                      <div>________________________________</div>

                      <Typography
                        sx={{
                          fontFamily: "Times New Roman",
                          fontWeight: "bold",
                          fontSize: "21px",
                        }}
                      >
                        {captainName}
                      </Typography>

                      <Typography
                        sx={{ fontFamily: "Times new roman", fontSize: "21px" }}
                      >
                        Barangay Chairman
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                mt: 2,
                minHeight: 170,
              }}
            >
              {/* Picture */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    border: "2px solid black",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontFamily: "Times New Roman", mt: 1 }}>
                  Picture
                </Typography>
              </Box>

              {/* Thumb Mark */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    border: "2px solid black",
                  }}
                />
                <Typography sx={{ fontFamily: "Times New Roman", mt: 1 }}>
                  Thumb Mark
                </Typography>
              </Box>

              {/* QR CODE – RIGHT CORNER, SAME SIZE, NO BORDER */}
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    marginTop: "-21px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "white",
                  }}
                >
                  {qrValue ? (
                    <QRCodeCanvas value={qrValue} size={140} level="H" />
                  ) : (
                    <Typography sx={{ fontSize: "10px" }}>
                      Select Resident
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* --- Note Section --- */}
            <Box
              sx={{
                mt: 2,
                mx: "auto",
                width: "80%",
                border: "1px solid black",
                p: 1,

                textAlign: "center",
              }}
            >
              <Typography
                sx={{ fontFamily: "Times New Roman", fontSize: "16px" }}
              >
                <b>Note:</b>{" "}
                {certType === "business_permit"
                  ? "Not valid without Barangay Chairman's signature and the barangay's seal."
                  : "This is only valid for six months and requires the Barangay Chairman’s signature and the barangay's seal."}
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>

      {isBarangayCertificate && (
        <>
          <Paper
            ref={barangayCertRef}
            className="hide-border-on-print"
            sx={{
              p: 3,
              minHeight: 400,
              maxWidth: "1200px",
              ml: 25,
              mt: 5,
              mb: 0,
              border: "2px solid black", // screen only
            }}
            elevation={2}
          >
            {/* content */}

            {/* ---- HEADER LOGOS ---- */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "150px",
              }}
            >
              {settings.logo_url && (
                <img
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Logo"
                  style={{
                    width: 160,
                    height: 160,
                    marginBottom: "-250px",
                    marginLeft: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <img
                src={LungsodngManila}
                alt="Manila Seal"
                style={{ width: 140, height: 140, marginBottom: "-140px" }}
              />

              <img
                src={BagongPilipinas}
                alt="Bagong Pilipinas"
                style={{
                  width: 180,
                  height: 160,
                  marginBottom: "-250px",
                  marginRight: "50px",
                }}
              />
            </Box>

            {/* ---- TEXT HEADER ---- */}
            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                mt: -2,
              }}
            >
              Republika ng Pilipinas
            </Typography>

            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                mt: -2,
              }}
            >
              Lungsod ng Maynila
            </Typography>

            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                fontWeight: "bold",
                letterSpacing: 3,
                color: "red",
                mt: -2,
              }}
            >
              {settings?.address || "Company Address"}
            </Typography>

            <Typography
              align="center"
              sx={{ fontSize: "18px", mt: -1, fontFamily: "Times New Roman" }}
            >
              Email address:{" "}
              <span style={{ color: "blue" }}>
                <u>barangay369zone37@gmail.com</u>
              </span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                py: 1,

                fontFamily: "Arial",
              }}
            >
              {/* Phone */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: -1 }}
              >
                <PhoneIcon sx={{ color: "#1b3a8a", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  (02) 87318622
                </Typography>
              </Box>

              {/* Facebook */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: -2 }}
              >
                <FacebookIcon sx={{ color: "#1877F2", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  Brgy Threesixnine
                </Typography>
              </Box>
            </Box>

            {/* ---- BLUE BAR ---- */}
            <Box
              sx={{
                backgroundColor: "#1b3a8a",
                color: "white",
                height: "35px",
                width: "92%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 5.5,
                fontFamily: "Cambria",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              OFFICE OF THE BARANGAY CHAIRMAN
            </Box>

            <Box
              sx={{
                position: "relative",
                p: 2,
              }}
            >
              {settings.logo_url && (
                <Box
                  component="img"
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Watermark"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "80%",
                    height: "90%",
                    borderRadius: "50%",
                    opacity: 0.15,
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                  }}
                />
              )}

              <Box sx={{ position: "relative", zIndex: 10, display: "flex" }}>
                {/* LEFT SIDE PANEL */}
                <Box
                  sx={{
                    width: "30%",
                    border: "3px solid #ADD8E6", // light blue
                    ml: 3.5,
                    p: 2,
                    mr: 1,
                    mt: 1,
                    backgroundColor: "transparent",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "red",
                      mb: 5,
                      fontFamily: "Cooper Black",
                      fontSize: "24px",
                    }}
                  >
                    SANGGUNIANG <br />
                    BARANGAY
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#003366",
                      fontSize: "16px",
                      textAlign: "center",
                      textDecoration: "underline",
                    }}
                  >
                    {officials.find((o) => o.is_captain)?.full_name || ""}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "15px",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      fontWeight: "bold",
                      color: "navy",
                      fontFamily: "Times new roman",
                      textAlign: "center",
                    }}
                  >
                    {captainName}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "red",
                      mb: 2,
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      fontSize: "16px",
                    }}
                  >
                    PUNONG BARANGAY
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      sx={{
                        border: "8px solid black",
                        p: "3px",
                      }}
                    >
                      <Box
                        sx={{
                          width: 200,
                          height: 250,
                          border: "5px solid black",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "transparent",
                        }}
                      >
                        {captainProfileUrl ? (
                          <img
                            src={captainProfileUrl}
                            alt="Captain Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="gray">
                            No Profile
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Sangguniang Barangay Title */}
                  {/* Chairman Section */}

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "red",
                      mt: 2,
                      mb: 1,
                      textAlign: "center",
                      fontFamily: "Times new roman",
                    }}
                  >
                    BARANGAY KAGAWAD
                  </Typography>

                  {officials
                    .filter((o) => o.position === "Barangay Kagawad")
                    .map((o) => (
                      <Typography
                        key={o.id}
                        sx={{
                          fontSize: "16px",
                          mb: 1,
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}

                  {officials
                    .filter(
                      (o) => o.position === "Sangguniang Kabataan Chairperson"
                    )
                    .map((o) => (
                      <Typography
                        key={o.id}
                        sx={{
                          mt: 4,
                          textDecoration: "underline",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    SK CHAIRMAN
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "navy",
                      fontFamily: "Times new roman",
                      textAlign: "center",
                    }}
                  >
                    {officials.find((o) => o.is_secretary)?.full_name ||
                      "SECRETARY NAME"}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    SECRETARY
                  </Typography>

                  {/* Barangay Kagawad */}

                  {/* Treasurer */}

                  {officials
                    .filter((o) => o.position === "Barangay Treasurer")
                    .map((o) => (
                      <Typography
                        key={o.id} // ✅ REQUIRED
                        sx={{
                          mt: 1,
                          textDecoration: "underline",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "navy",
                          fontFamily: "Times new roman",
                          textAlign: "center",
                        }}
                      >
                        {o.full_name}
                      </Typography>
                    ))}

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "red",
                      textAlign: "center",
                      fontFamily: "Times new roman",
                      mb: 3,
                    }}
                  >
                    TREASURER
                  </Typography>
                </Box>

                {/* RIGHT SIDE CONTENT (Certificate Body) */}
                <Box sx={{ width: "72%", pr: 2, mr: 4 }}>
                  {/* MAIN TITLE */}
                  {/* MAIN TITLE (CUSTOMIZABLE) */}
                  <Typography
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "36px",
                      color: "navy",
                      letterSpacing: "3px",
                      mt: 1,
                      fontFamily: "Stencil",
                    }}
                  >
                    {typeof mainTitle === "string"
                      ? mainTitle.toUpperCase()
                      : mainTitle}
                  </Typography>

                  {/* SUBTITLE (OPTIONAL) */}
                  {finalSubtitle && (
                    <Typography
                      align="center"
                      sx={{
                        fontSize: "21px",
                        fontStyle: "italic",
                        mt: "-4px",
                        color: "#000",
                        fontFamily: "Times New Roman",
                      }}
                    >
                      {finalSubtitle}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      mt: 2,
                      fontSize: "21px",
                      fontFamily: "Times New Roman",
                      lineHeight: 1.7,
                      marginLeft: 6,
                    }}
                  >
                    <p style={{ textAlign: "justify", textIndent: "45px" }}>
                      This is to certify that{" "}
                      <b>{buildFullName(selectedResident)?.toUpperCase()}</b>, a
                      resident of{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        {selectedResident?.address}
                      </span>
                      , for{" "}
                      <u>
                        <strong>{yearsInBarangay || "___"}</strong>
                      </u>{" "}
                      years, is a qualified availee of RA 11261 or the First
                      Time Jobseekers Assistance Act of 2019.
                    </p>

                    <p style={{ textAlign: "justify", textIndent: "45px" }}>
                      I further certify that the holder/bearer was informed of
                      his/her rights, including the duties and responsibilities
                      accorded by RA 11261 through the{" "}
                      <div
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Times new roman",
                        }}
                      >
                        Oath of Undertaking
                      </div>{" "}
                      he/she has signed and executed in the presence of our
                      Barangay Officials.
                    </p>

                    <p style={{ textAlign: "justify", textIndent: "45px" }}>
                      Signed this{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        {(() => {
                          const d = new Date(issueDate);
                          const day = d.getDate();
                          const ordinal =
                            day % 10 === 1 && day !== 11
                              ? "st"
                              : day % 10 === 2 && day !== 12
                              ? "nd"
                              : day % 10 === 3 && day !== 13
                              ? "rd"
                              : "th";
                          const month = d.toLocaleString("en-US", {
                            month: "long",
                          });
                          const year = d.getFullYear();
                          return (
                            <>
                              {day}
                              <sup
                                style={{
                                  fontSize: "0.6em",
                                  verticalAlign: "super",
                                  marginLeft: "1px",
                                }}
                              >
                                {ordinal}
                              </sup>{" "}
                              day of {month}, {year}
                            </>
                          );
                        })()}
                      </span>{" "}
                      , at {barangayName}, {municipality}, {province}.
                    </p>

                    <p style={{ textAlign: "justify", textIndent: "45px" }}>
                      This certification is valid only for one (1) year from the
                      issuance.
                    </p>
                  </Box>

                  {/* SIGNATURES SECTION */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: isResidency
                        ? "flex-end"
                        : "space-between",
                      width: "100%",
                      mt: 6,
                      px: 2,
                    }}
                  >
                    {/* --- Prepared By (Left Side) --- */}
                    {!isResidency && (
                      <Box sx={{ textAlign: "center", marginLeft: 1 }}>
                        <Typography
                          sx={{
                            textAlign: "left",
                            marginTop: "180px",
                            mb: 2,
                            fontFamily: "Times new roman",
                            fontSize: "21px",
                          }}
                        >
                          Prepared by:
                        </Typography>

                        {secretarySignatureUrl && (
                          <img
                            src={secretarySignatureUrl}
                            alt="Secretary Signature"
                            style={{
                              width: 250,
                              height: 100,
                              objectFit: "contain",
                              marginBottom: "-50px",
                              marginTop: "-50px",
                            }}
                          />
                        )}

                        <div>________________________________</div>

                        <Typography
                          sx={{
                            fontFamily: "Times New Roman",
                            fontWeight: "bold",
                            fontSize: "21px",
                          }}
                        >
                          {secretaryName}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: "Times new roman",
                            fontSize: "21px",
                          }}
                        >
                          Barangay Secretary
                        </Typography>
                      </Box>
                    )}

                    {/* --- Certified By (Right Side) --- */}
                    <Box sx={{ textAlign: "center", marginLeft: -4 }}>
                      <Typography
                        sx={{
                          textAlign: "left",
                          marginTop: isResidency ? "150px" : "50px",
                          mb: 2,
                          fontFamily: "Times new roman",
                          fontSize: "21px",
                        }}
                      >
                        Certified by:
                      </Typography>

                      {captainSignatureUrl && (
                        <img
                          src={captainSignatureUrl}
                          alt="Captain Signature"
                          style={{
                            width: 250,
                            height: 100,
                            objectFit: "contain",
                            marginBottom: "-50px",
                            marginTop: "-50px",
                          }}
                        />
                      )}

                      <div>________________________________</div>

                      <Typography
                        sx={{
                          fontFamily: "Times New Roman",
                          fontWeight: "bold",
                          fontSize: "21px",
                        }}
                      >
                        {captainName}
                      </Typography>

                      <Typography
                        sx={{ fontFamily: "Times new roman", fontSize: "21px" }}
                      >
                        Barangay Chairman
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                mt: 2,
                minHeight: 170,
              }}
            >
              {/* Picture */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    border: "2px solid black",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontFamily: "Times New Roman", mt: 1 }}>
                  Picture
                </Typography>
              </Box>

              {/* Thumb Mark */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    border: "2px solid black",
                  }}
                />
                <Typography sx={{ fontFamily: "Times New Roman", mt: 1 }}>
                  Thumb Mark
                </Typography>
              </Box>

              {/* QR CODE – RIGHT CORNER, SAME SIZE, NO BORDER */}
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    marginTop: "-21px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "white",
                  }}
                >
                  {qrValue ? (
                    <QRCodeCanvas value={qrValue} size={140} level="H" />
                  ) : (
                    <Typography sx={{ fontSize: "10px" }}>
                      Select Resident
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* --- Note Section --- */}
            <Box
              sx={{
                mt: 2,
                mx: "auto",
                width: "80%",
                border: "1px solid black",
                p: 1,

                textAlign: "center",
              }}
            >
              <Typography
                sx={{ fontFamily: "Times New Roman", fontSize: "16px" }}
              >
                <b>Note:</b>{" "}
                {certType === "business_permit"
                  ? "Not valid without Barangay Chairman's signature and the barangay's seal."
                  : "This is only valid for six months and requires the Barangay Chairman’s signature and the barangay's seal."}
              </Typography>
            </Box>
          </Paper>

          <div className="page-break" />

          <Paper
            ref={oathRef}
            className="print-page"
            sx={{
              p: 3,
              minHeight: 400,
              maxWidth: "1200px",
              ml: 25,
              mt: 5,
              border: "2px solid black",
            }}
            elevation={2}
          >
            {/* ================= HEADER LOGOS ================= */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "150px",
              }}
            >
              {settings.logo_url && (
                <img
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Logo"
                  style={{
                    width: 170,
                    height: 160,
                    marginBottom: "-250px",
                    marginLeft: "50px",
                  }}
                />
              )}

              <img
                src={LungsodngManila}
                alt="Manila Seal"
                style={{ width: 140, height: 140, marginBottom: "-140px" }}
              />

              <img
                src={BagongPilipinas}
                alt="Bagong Pilipinas"
                style={{
                  width: 170,
                  height: 160,
                  marginBottom: "-250px",
                  marginRight: "50px",
                }}
              />
            </Box>

            {/* ================= TEXT HEADER ================= */}
            <Typography
              align="center"
              sx={{ fontSize: "32px", fontFamily: "Cambria", mt: -2 }}
            >
              Republika ng Pilipinas
            </Typography>

            <Typography
              align="center"
              sx={{ fontSize: "32px", fontFamily: "Cambria", mt: -2 }}
            >
              Lungsod ng Maynila
            </Typography>

            <Typography
              align="center"
              sx={{
                fontSize: "32px",
                fontFamily: "Cambria",
                fontWeight: "bold",
                letterSpacing: 3,
                color: "red",
                mt: -2,
              }}
            >
              {settings.address}
            </Typography>

            <Typography
              align="center"
              sx={{ fontSize: "18px", mt: -1, fontFamily: "Times New Roman" }}
            >
              Email address:{" "}
              <span style={{ color: "blue" }}>
                <u>barangay369zone37@gmail.com</u>
              </span>
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 4, py: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ color: "#1b3a8a", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  (02) 87318622
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FacebookIcon sx={{ color: "#1877F2", fontSize: 28 }} />
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                  Brgy Threesixnine
                </Typography>
              </Box>
            </Box>

            {/* ================= BLUE BAR ================= */}
            <Box
              sx={{
                backgroundColor: "#1b3a8a",
                color: "white",
                height: "35px",
                width: "92%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 5.5,
                fontFamily: "Cambria",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              OFFICE OF THE BARANGAY CHAIRMAN
            </Box>

            {/* ================= WATERMARK + CONTENT ================= */}
            <Box sx={{ position: "relative", p: 2 }}>
              {settings.logo_url && (
                <Box
                  component="img"
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Watermark"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "80%",
                    height: "70%",
                    opacity: 0.15,
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                  }}
                />
              )}

              <Box sx={{ position: "relative", zIndex: 1, px: 6 }}>
                {/* ================= TITLE ================= */}
                <Typography
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "36px",
                    color: "navy",
                    letterSpacing: "3px",
                    mt: 2,
                    fontFamily: "Stencil",
                  }}
                >
                  OATH OF UNDERTAKING
                </Typography>

                {/* ================= BODY ================= */}
                <Box
                  sx={{
                    mt: 4,
                    fontFamily: "Times New Roman",
                    fontSize: "21px",
                    lineHeight: 1.8,
                    textAlign: "justify",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Times New Roman",
                      fontSize: "21px",
                      lineHeight: 1.6,
                    }}
                    paragraph
                  >
                    I,{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {buildFullName(selectedResident)?.toUpperCase()}
                    </span>
                    ,{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {oathAge || "___"}
                    </span>{" "}
                    years of age, resident of{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {selectedResident?.address ||
                        "__________________________"}
                    </span>
                    , for{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {yearsInBarangay || "___"}
                    </span>{" "}
                    years, availing the benefits of Republic Act 11261,
                    otherwise known as the First Time Jobseekers Act of 2019, do
                    hereby declare, agree and undertake to abide and be bound by
                    the following:
                  </Typography>

                  {/* ================= NUMBERED OATHS ================= */}
                  <Box component="ol" sx={{ pl: 4, mt: 2 }}>
                    {oathStatements.map((text, index) => (
                      <li key={index}>
                        <Typography
                          sx={{
                            fontFamily: "times new roman",
                            fontSize: "21px",
                            ml: 2,
                          }}
                        >
                          {text}
                        </Typography>
                      </li>
                    ))}
                  </Box>

                  <Typography
                    sx={{
                      mt: 4,
                      fontFamily: "times new roman",
                      fontSize: "21px",
                    }}
                  >
                    Signed this
                    <span
                      style={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      {(() => {
                        const d = new Date(issueDate);
                        const day = d.getDate();
                        const ordinal =
                          day % 10 === 1 && day !== 11
                            ? "st"
                            : day % 10 === 2 && day !== 12
                            ? "nd"
                            : day % 10 === 3 && day !== 13
                            ? "rd"
                            : "th";
                        const month = d.toLocaleString("en-US", {
                          month: "long",
                        });
                        const year = d.getFullYear();
                        return (
                          <>
                            {day}
                            <sup
                              style={{
                                fontSize: "0.6em",
                                verticalAlign: "super",
                                marginLeft: "1px",
                              }}
                            >
                              {ordinal}
                            </sup>{" "}
                            day of {month}, {year}
                          </>
                        );
                      })()}
                    </span>{" "}
                    , in the City of Manila.
                  </Typography>
                </Box>

                {/* ================= SIGNATURE ================= */}
                <Box sx={{ mt: 6 }}>
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        fontSize: "21px",
                        textDecoration: "underline",
                        display: "inline-block",
                        minWidth: "300px",
                        textAlign: "left",
                        mt: 2,
                      }}
                    >
                      {buildFullName(selectedResident)?.toUpperCase()}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "Times New Roman",
                        fontSize: "21px",
                        mt: 0.5,
                        textAlign: "left",
                      }}
                    >
                      First Time Jobseeker
                    </Typography>
                  </Box>
                </Box>

                {/* ================= FOOTER ================= */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        textAlign: "left",
                        marginTop: "100px",
                        mb: 2,
                        fontFamily: "Times new roman",
                        fontSize: "21px",
                      }}
                    >
                      Witnessed by:
                    </Typography>

                    {/* SECRETARY SIGNATURE IMAGE */}
                    {secretarySignatureUrl && (
                      <img
                        src={secretarySignatureUrl}
                        alt="Secretary Signature"
                        style={{
                          width: 250,
                          height: 100,
                          objectFit: "contain",
                          marginBottom: "-50px",
                          marginTop: "-50px",
                        }}
                      />
                    )}

                    <div>________________________________</div>

                    <Typography
                      sx={{
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        fontSize: "21px",
                      }}
                    >
                      {secretaryName}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "Times new roman", fontSize: "21px" }}
                    >
                      Barangay Secretary
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        textAlign: "left",
                        marginTop: "-20px",
                        mb: 2,
                        fontFamily: "Times new roman",
                        fontSize: "21px",
                      }}
                    >
                      Certified by:
                    </Typography>

                    {/* CAPTAIN SIGNATURE IMAGE */}
                    {captainSignatureUrl && (
                      <img
                        src={captainSignatureUrl}
                        alt="Captain Signature"
                        style={{
                          width: 250,
                          height: 100,
                          objectFit: "contain",
                          marginBottom: "-50px",
                          marginTop: "-50px",
                        }}
                      />
                    )}

                    <div sx={{ maginRight: "50px" }}>
                      ________________________________
                    </div>

                    <Typography
                      sx={{
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        fontSize: "21px",
                      }}
                    >
                      {captainName}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "Times new roman", fontSize: "21px" }}
                    >
                      Barangay Chairman
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {isAcknowledgementReceipt && (
        <Paper
          ref={acknowledgementRef}
          className="hide-border-on-print"
          sx={{
            p: 3,
            minHeight: 400,
            maxWidth: "1200px",
            ml: 25,
            mt: 6,
            mb: 0,
            border: "2px solid black", // screen only
          }}
          elevation={2}
        >
          {/* content */}

          {/* ---- HEADER LOGOS ---- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "150px",
            }}
          >
            {settings.logo_url && (
              <img
                src={`${API_ROOT}${settings.logo_url}`}
                alt="Barangay Logo"
                style={{
                  width: 160,
                  height: 160,
                  marginBottom: "-250px",
                  marginLeft: "50px",
                  borderRadius: "50%",
                }}
              />
            )}

            <img
              src={LungsodngManila}
              alt="Manila Seal"
              style={{ width: 140, height: 140, marginBottom: "-140px" }}
            />

            <img
              src={BagongPilipinas}
              alt="Bagong Pilipinas"
              style={{
                width: 180,
                height: 160,
                marginBottom: "-250px",
                marginRight: "50px",
              }}
            />
          </Box>

          {/* ---- TEXT HEADER ---- */}
          <Typography
            align="center"
            sx={{
              fontSize: "32px",
              fontFamily: "Cambria",
              mt: -2,
            }}
          >
            Republika ng Pilipinas
          </Typography>

          <Typography
            align="center"
            sx={{
              fontSize: "32px",
              fontFamily: "Cambria",
              mt: -2,
            }}
          >
            Lungsod ng Maynila
          </Typography>

          <Typography
            align="center"
            sx={{
              fontSize: "32px",
              fontFamily: "Cambria",
              fontWeight: "bold",
              letterSpacing: 3,
              color: "red",
              mt: -2,
            }}
          >
            {settings?.address || "Company Address"}
          </Typography>

          <Typography
            align="center"
            sx={{ fontSize: "18px", mt: -1, fontFamily: "Times New Roman" }}
          >
            Email address:{" "}
            <span style={{ color: "blue" }}>
              <u>barangay369zone37@gmail.com</u>
            </span>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              py: 1,
            }}
          >
            {/* Phone */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: -1 }}>
              <PhoneIcon sx={{ color: "#1b3a8a", fontSize: 28 }} />
              <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                (02) 87318622
              </Typography>
            </Box>

            {/* Facebook */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: -2 }}>
              <FacebookIcon sx={{ color: "#1877F2", fontSize: 28 }} />
              <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                Brgy Threesixnine
              </Typography>
            </Box>
          </Box>

          {/* ---- BLUE BAR ---- */}
          <Box
            sx={{
              backgroundColor: "#1b3a8a",
              color: "white",
              height: "35px",
              width: "92%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 5.5,
              fontFamily: "Cambria",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            OFFICE OF THE BARANGAY CHAIRMAN
          </Box>

          <Box
            sx={{
              position: "relative",
              p: 2,
              mt: 3,
            }}
          >
            {settings.logo_url && (
              <Box
                component="img"
                src={`${API_ROOT}${settings.logo_url}`}
                alt="Barangay Watermark"
                sx={{
                  position: "absolute",
                  top: "48%",
                  left: "50%",
                  width: "80%",
                  height: "80%",
                  borderRadius: "50%",
                  opacity: 0.15,
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              />
            )}
            {certType === "awknowledgement_receipt" ? (
              <>
                {/* ===== ACKNOWLEDGEMENT RECEIPT CONTENT ===== */}

                <Typography
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "36px",
                    color: "navy",
                    letterSpacing: "3px",
                    fontFamily: "Stencil",
                    mt: 2,
                    mb: 8,
                  }}
                >
                  ACKNOWLEDGMENT RECEIPT
                </Typography>

                <Box
                  sx={{
                    mt: 15,
                    ml: 4,
                    fontFamily: '"Times New Roman", Times, serif !important',
                    fontSize: "21px !important",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Times New Roman", Times, serif !important',
                      fontSize: "21px !important",
                      display: "flex",
                    }}
                  >
                    Receipt No: <div style={{borderBottom: "1px solid black", width: "215px", marginLeft: "4px", textAlign: "center", height: "26px"}}></div>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Times New Roman", Times, serif !important',
                      fontSize: "21px !important",
                      display: "flex",
                      mb: 4,
                    }}
                  >
                    Date: <div style={{borderBottom: "1px solid black", width: "270px", marginLeft: "4px", textAlign: "center", height: "26px"}}>{formattedIssueDate}</div>
                  </Typography>

                  <Box sx={{ mt: 5, textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontFamily:
                          '"Times New Roman", Times, serif !important',
                        fontSize: "21px !important",
                        letterSpacing: "2px",
                        display: "flex",
                      }}
                    >
                      <Box component="span" sx={{ ml: 10 }}>
                        Received from
                      </Box>{" "}
                      <div style={{borderBottom: "1px solid black", width: "380px", marginLeft: "9px", marginRight: "9px", textAlign: "center", height: "26px"}}></div> 
                      of
                      <div style={{borderBottom: "1px solid black", width: "380px", marginLeft: "9px", marginRight: "9px", textAlign: "center", height: "26px"}}></div> 
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontFamily:
                          '"Times New Roman", Times, serif !important',
                        fontSize: "21px !important",
                        letterSpacing: "2px",
                        display: "flex",
                      }}
                    >
                      the amount of <div style={{borderBottom: "1px solid black", width: "380px", marginLeft: "9px", marginRight: "9px", textAlign: "center", height: "26px"}}>{amountInWords}</div> 
 as payment for
                      <strong style={{marginLeft: "7px"}}> Barangay Clearance/Permit</strong>.
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      mt: 40,
                      color: "red",
                      fontFamily: '"Times New Roman", Times, serif !important',
                      fontSize: "21px !important",
                    }}
                  >
                    Note: Donation for Barangay Funds.
                  </Typography>

                  <Box sx={{ textAlign: "left", mt: 20 }}>
                    <Typography
                      sx={{
                        mb: 2,
                        fontFamily:
                          '"Times New Roman", Times, serif !important',
                        fontSize: "21px !important",
                      }}
                    >
                      Certified by:
                    </Typography>

                    {captainSignatureUrl && (
                      <img
                        src={captainSignatureUrl}
                        alt="Captain Signature"
                        style={{
                          width: 250,
                          height: 100,
                          objectFit: "contain",
                          marginBottom: "-50px",
                          marginTop: "-50px",
                        }}
                      />
                    )}

                    <div>____________________</div>

                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontFamily:
                          '"Times New Roman", Times, serif !important',
                        fontSize: "21px !important",
                      }}
                    >
                      {captainName}
                    </Typography>

                    <Typography
                      sx={{
                        mb: 24,
                        fontFamily:
                          '"Times New Roman", Times, serif !important',
                        fontSize: "21px !important",
                      }}
                    >
                      Barangay Chairman
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                {/* ===== EXISTING CERTIFICATE CONTENT ===== */}
                {/* WALA KANG GINALAW DITO */}
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Mark Para san ito? */}
      <div
        className={`print-only ${
          printMode === "certificate_form" ? "active-print" : ""
        }`}
        style={{display: printMode === "certificate_form" ? "block" : "none",}}
      >
        <Box
          sx={{
            width: "100%",
            position: "relative",
            padding: 2,
            marginTop: "-18px",
            marginBottom: 0
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
              zIndex: 10,
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
              zIndex: 10,
            }}
          />

          {/* --- YOUR 4 FORMS --- */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "48%",
                  border: "2px solid black",
                  padding: "21px",
                  fontFamily: "Arial",
                  fontSize: "13px",
                  position: "relative",
                  background: "white",
                }}
              >
                {/* HEADER LOGOS */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: -2,
                    mb: 1,
                    ml: -1,
                    mr: -1,
                  }}
                >
                  {settings.logo_url && (
                    <img
                      src={`${API_BASE_URL}${settings.logo_url}`}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        ml: -4,
                      }}
                      alt="Barangay Logo"
                    />
                  )}
                  <img
                    src={LungsodngManila}
                    style={{ width: 50, height: 50 }}
                  />
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
                    settings.address
                      .split(/,\s*(?=DISTRICT)/i)
                      .map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i === 0 && <br />}
                        </React.Fragment>
                      ))}
                </Typography>

                {/* REQUEST FORM FOR */}
                <Typography
                  sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                >
                  REQUEST FORM FOR:
                </Typography>

                {/* CHECKBOXES */}
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 15,
                        height: 15,
                        border: "1px solid black",
                        borderRadius: "50%",
                        fontSize: "14px",
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    BARANGAY CERTIFICATE
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 15,
                        height: 15,
                        border: "1px solid black",
                        borderRadius: "50%",
                        fontSize: "14px",
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    BARANGAY INDIGENCY
                  </Box>
                </Box>

                {/* --- FIELD LINES (NO HELPER FUNCTION!) --- */}
                {[
                  "FIRST NAME",
                  "MIDDLE NAME",
                  "LAST NAME",
                  "ADDRESS",
                  "DATE OF BIRTH",
                ].map((label) => (
                  <Box
                    key={label}
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <Typography
                      sx={{
                        width: "121px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {label}:
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid black",
                        flexGrow: 1,
                        height: "21px",
                      }}
                    />
                  </Box>
                ))}

                {/* AGE + CIVIL STATUS */}
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100px",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        width: "50px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      AGE:
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid black",
                        flexGrow: 1,
                        height: "21px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 1,
                      ml: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        width: "121px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      CIVIL STATUS:
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid black",
                        flexGrow: 1,
                        height: "21px",
                      }}
                    />
                  </Box>
                </Box>

                {/* REGISTERED VOTER */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  {/* Question */}
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "14px", mr: 3, mb: 1 }}
                  >
                    Are you a Registered Voter?
                  </Typography>

                  {/* YES */}
                  <Box
                    sx={{ display: "flex", alignItems: "center", mr: 4, mb: 1 }}
                  >
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        border: "1px solid black",
                        borderRadius: "50%",
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      YES
                    </Typography>
                  </Box>

                  {/* NO */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        border: "1px solid black",
                        borderRadius: "50%",
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      NO
                    </Typography>
                  </Box>
                </Box>

                {/* PURPOSE */}
                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}
                >
                  <Typography
                    sx={{ width: "75px", fontWeight: "bold", fontSize: "14px" }}
                  >
                    PURPOSE:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                {/* CONTACT NO */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    sx={{
                      width: "110px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    CONTACT NO.:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box
                  sx={{ display: "flex", mt: 1, alignItems: "center", mb: 1 }}
                >
                  <Typography
                    sx={{ width: "60px", fontWeight: "bold", fontSize: "14px" }}
                  >
                    DATE:
                  </Typography>

                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      width: "150px",
                      height: "21px",
                      mr: 2,
                      mb: 1,
                    }}
                  />
                  <Typography sx={{ fontSize: "12px" }}>
                    Messenger: Sec Gilda Peralta Matabang
                  </Typography>
                </Box>

                {/* FOOTER */}
                <Box
                  sx={{
                    border: "1px solid black",

                    textAlign: "center",
                    fontSize: "12px",
                    mt: 1,
                    fontWeight: "bold",
                    mb: 0.7,
                  }}
                >
                  Please attach xerox copy of any Valid ID.
                </Box>
                <Typography sx={{ fontSize: "12px", mt: 1 }}>
                  Request Form: (Look for Sec. Gilda / Steve Matabang)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </div>

      <div
          className={`print-only ${
            printMode === "jobseeker" ? "active-print" : ""
          }`}
          style={{
            display: printMode === "jobseeker" ? "block" : "none",
          }}
        >
        <Box
          sx={{
            width: "100%",
            position: "relative",
            padding: 2,
            marginTop: "-20px",
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
              zIndex: 10,
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
              zIndex: 10,
            }}
          />

          {/* --- YOUR 4 FORMS --- */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "48%",
                  border: "2px solid black",
                  padding: "21px",
                  fontFamily: "Arial",
                  fontSize: "13px",
                  position: "relative",
                  background: "white",
                }}
              >
                {/* HEADER LOGOS */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: -2,
                    mb: 1,
                    ml: -1,
                    mr: -1,
                  }}
                >
                  {settings.logo_url && (
                    <img
                      src={`${API_BASE_URL}${settings.logo_url}`}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        ml: -4,
                      }}
                      alt="Barangay Logo"
                    />
                  )}
                  <img
                    src={LungsodngManila}
                    style={{ width: 50, height: 50 }}
                  />
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
                    settings.address
                      .split(/,\s*(?=DISTRICT)/i)
                      .map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i === 0 && <br />}
                        </React.Fragment>
                      ))}
                </Typography>

                {/* REQUEST FORM FOR */}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  FIRST TIME JOBSEEKER CERTIFICATION REQUEST FORM
                </Typography>

                {/* CHECKBOXES */}

                {/* --- FIELD LINES (NO HELPER FUNCTION!) --- */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "100px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    FIRST NAME:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "121px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    MIDDLE NAME:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "121px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    LAST NAME:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "600px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                      mt: 0.5,
                    }}
                  >
                    HOW LONG HAVE YOU BEEN IN YOUR PRESENT:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "15px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "15px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "75px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    ADDRESS:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "121px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    DATE OF BIRTH:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100px",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "50px",
                        fontWeight: "bold",
                        fontSize: "12.5px",
                      }}
                    >
                      AGE:
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid black",
                        flexGrow: 1,
                        height: "21px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 1,
                      ml: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        width: "121px",
                        fontWeight: "bold",
                        fontSize: "12.5px",
                      }}
                    >
                      CIVIL STATUS:
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid black",
                        flexGrow: 1,
                        height: "21px",
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "600px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    EDUCATIONAL LEVEL: (ELEM./HS/VOC./COLLEGE/OOSY):
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "15px",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  {/* Question */}
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "12.5px", mr: 3 }}
                  >
                    Are you a Registered Voter?
                  </Typography>

                  {/* YES */}
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        border: "1px solid black",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography sx={{ fontSize: "12.5px", fontWeight: "bold" }}>
                      YES
                    </Typography>
                  </Box>

                  {/* NO */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        border: "1px solid black",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography sx={{ fontSize: "12.5px", fontWeight: "bold" }}>
                      NO
                    </Typography>
                  </Box>
                </Box>

                {/* CONTACT NO */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "110px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    CONTACT NO.:
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      flexGrow: 1,
                      height: "21px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: "60px",
                      fontWeight: "bold",
                      fontSize: "12.5px",
                    }}
                  >
                    DATE:
                  </Typography>

                  <Box
                    sx={{
                      borderBottom: "1px solid black",
                      width: "150px",
                      height: "21px",
                      mr: 2,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    border: "1px solid black",

                    textAlign: "center",
                    fontSize: "12px",
                    mt: 1,
                    fontWeight: "bold",
                  }}
                >
                  Please attach xerox copy of any Valid ID.
                </Box>

                {/* FOOTER */}

                <Typography sx={{ fontSize: "12.5px", mt: 1 }}>
                  Messenger: MsGilda Peralta
                </Typography>

                <Typography sx={{ fontSize: "12.5px", mt: 1 }}>
                  Request Form: (Look for Sec. Gilda / Steve Matabang)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </div>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 10,
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f5f7fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontFamily: "Times New Roman",
            }}
          >
            Edit Certificate Content
          </Typography>

          <IconButton onClick={() => setEditorOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* BODY */}
        <DialogContent sx={{ px: 3, pt: 3 }}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <ReactQuill
              theme="snow"
              value={certificateBody}
              onChange={(html) => {
                setIsManuallyEdited(true);
                setCertificateBody(html);
              }}
              style={{
                height: 420,
                backgroundColor: "#ffffff",
              }}
            />
          </Box>
        </DialogContent>

        {/* FOOTER ACTIONS */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #ddd",
            backgroundColor: "#f5f7fa",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setEditorOpen(false)}
            sx={{ fontWeight: "bold" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={saveTemplate}
            sx={{
              fontWeight: "bold",
              px: 4,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificatesPage;
