import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Input,
  InputLabel,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import api from "../api";
import API_BASE_URL from "../ApiConfig";

const API_ROOT = `${API_BASE_URL}`;

/**
 * This component keeps YOUR original logic/endpoints
 * but applies the SAME UX / layout / styling patterns
 * used in the second (reference) Settings component.
 */
function Settings({ settings, onUpdate }) {
  // Left side
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [footerText, setFooterText] = useState("");

  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [previewBg, setPreviewBg] = useState(null);
  const [ipAddress, setIpAddress] = useState("");

  // Right side (colors)
  const [headerColor, setHeaderColor] = useState("#ffffff");
  const [footerColor, setFooterColor] = useState("#ffffff");
  const [mainButtonColor, setMainButtonColor] = useState("#ffffff");
  const [sidebarButtonColor, setSidebarButtonColor] = useState("#000000");

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const handleCloseSnack = (_, reason) => {
    if (reason !== "clickaway") setSnack((p) => ({ ...p, open: false }));
  };

  // Load settings
  useEffect(() => {
    if (!settings) return;

    setCompanyName(settings.company_name ?? "");
    setAddress(settings.address ?? "");
    setFooterText(settings.footer_text ?? "");

    setHeaderColor(settings.header_color ?? "#ffffff");
    setFooterColor(settings.footer_color ?? "#ffffff");
    setMainButtonColor(settings.main_button_color ?? "#ffffff");
    setSidebarButtonColor(settings.sidebar_button_color ?? "#000000");

    setPreviewLogo(settings.logo_url ? `${API_ROOT}${settings.logo_url}` : null);
    setPreviewBg(settings.bg_image ? `${API_ROOT}${settings.bg_image}` : null);
    setIpAddress(settings.ip_address ?? "");
  }, [settings]);

  // Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("company_name", companyName);
    formData.append("address", address);
    formData.append("footer_text", footerText);
    formData.append("header_color", headerColor);
    formData.append("footer_color", footerColor);
    formData.append("main_button_color", mainButtonColor);
    formData.append("sidebar_button_color", sidebarButtonColor);
    formData.append("ip_address", ipAddress);

    if (logo) formData.append("logo", logo);
    if (bgImage) formData.append("bg_image", bgImage);


    try {
      await api.put("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnack({ open: true, message: "Settings updated successfully!", severity: "success" });
      onUpdate?.();
    } catch (err) {
      setSnack({ open: true, message: "Error updating settings", severity: "error" });

    }
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
          SETTINGS
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <TableContainer
        component={Paper}
        sx={{
          width: "95.05%",
          ml: 3,
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
                Settings
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Paper
        sx={{
          p: 3,
          mt: -1,
          display: "flex",
          gap: 5,
          ml: 3,
          width: "95%",
          flexDirection: { xs: "column", md: "row" },
          border: "3px solid black",
        }}
      >
        {/* LEFT COLUMN */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="black">
            Customize your Settings
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { label: "Company Name", value: companyName, setter: setCompanyName },
              { label: "Address", value: address, setter: setAddress },
              { label: "Footer Text", value: footerText, setter: setFooterText },
            ].map((f) => (
              <Box key={f.label} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ width: 150, fontWeight: 500 }}>{f.label}:</Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                />
              </Box>
            ))}
          </Box>

          {/* LOGO UPLOAD */}
          <Box>
            <Typography sx={{ fontWeight: 500 }}>Logo:</Typography>
            <hr style={{ border: "1px solid #ccc", marginBottom: 10 }} />
            <Button variant="contained" component="label">
              Choose Logo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setLogo(e.target.files[0]);
                  setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Button>

            {previewLogo && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Box
                  component="img"
                  src={previewLogo}
                  sx={{ width: 100, height: 100, borderRadius: 2, border: "2px solid #ccc", objectFit: "cover" }}
                />
              </Box>
            )}
          </Box>

          {/* BACKGROUND IMAGE */}
          <Box>
            <Typography sx={{ fontWeight: 500 }}>Background Image:</Typography>
            <hr style={{ border: "1px solid #ccc", marginBottom: 10 }} />
            <Button variant="contained" component="label">
              Choose Background
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setBgImage(e.target.files[0]);
                  setPreviewBg(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Button>

            {previewBg && (
              <Box
                component="img"
                src={previewBg}
                sx={{ mt: 2, width: "100%", height: 400, borderRadius: 2, border: "2px solid #ccc", objectFit: "cover" }}
              />
            )}
          </Box>
        </Box>

        {/* RIGHT COLUMN */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="black">
            Theme Colors
          </Typography>

          {[
            { label: "Header Color", value: headerColor, setter: setHeaderColor },
            { label: "Footer Color", value: footerColor, setter: setFooterColor },
            { label: "Main Button Color", value: mainButtonColor, setter: setMainButtonColor },
            { label: "Sidebar Button Color", value: sidebarButtonColor, setter: setSidebarButtonColor },
          ].map((c) => (
            <Box key={c.label} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <InputLabel sx={{ fontWeight: 500 }}>{c.label}:</InputLabel>

              <Box
                sx={{
                  height: 50,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "2px solid #ccc",
                  cursor: "pointer",
                  display: "flex",
                }}
                onClick={() => document.getElementById(c.label).click()}
              >
                <Box sx={{ flex: 1, backgroundColor: c.value }} />
                <Input
                  id={c.label}
                  type="color"
                  value={c.value}
                  onChange={(e) => c.setter(e.target.value)}
                  sx={{ opacity: 0, width: 0, height: 0 }}
                />
              </Box>

              <hr style={{ border: "1px solid #ccc", width: "100%", marginTop: 10 }} />
            </Box>
          ))}

          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ width: 150, fontWeight: 500 }}>
              Network IP:
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. 192.168.1.5"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </Box> */}

          {/* SAVE BUTTON */}
          <Button
            variant="contained"
            sx={{
              mt: 4,
              py: 1.5,
              width: 250,
              fontWeight: "bold",
              alignSelf: "flex-end",
            }}
            onClick={handleSubmit}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      {/* SNACKBAR */}
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
  );
}

export default Settings;
