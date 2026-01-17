import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import api from "../api";
import API_BASE_URL from "../ApiConfig";

const API_ROOT = `${API_BASE_URL}`;

export default function ForgotPassword({ goBack }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        api.get("/public/settings").then((res) => setSettings(res.data));
    }, []);

    const handleSubmit = async () => {
        if (!email) {
            showSnackbar("Email is required", "warning");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/forgot-password", { email });
            showSnackbar(res.data.message, "success");
            setEmail("");
        } catch (err) {
            showSnackbar(err?.response?.data?.message || "Reset failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveOtp = async () => {
        try {
            await api.put("/api/user/security-settings", {
                require_otp: otpRequired,
            });

            setSnack({
                open: true,
                message: "OTP setting updated",
                severity: "success",
            });
        } catch (err) {
            setSnack({
                open: true,
                message: err.response?.data?.message || "Failed to update OTP",
                severity: "error",
            });
        }
    };

    // // 🔒 Disable right-click
    // document.addEventListener('contextmenu', (e) => e.preventDefault());

    // // 🔒 Block DevTools shortcuts + Ctrl+P silently
    // document.addEventListener('keydown', (e) => {
    //     const isBlockedKey =
    //         e.key === 'F12' || // DevTools
    //         e.key === 'F11' || // Fullscreen
    //         (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
    //         (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
    //         (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

    //     if (isBlockedKey) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     }
    // });



    return (
        <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
            <Container maxWidth={false} sx={{ display: "flex", justifyContent: "center", marginTop: "-10vh" }}>
                <div
                    style={{
                        transform: "scale(0.8)",
                        backgroundColor: "white",
                        maxWidth: 540,
                        width: "100%",
                        borderRadius: "10px",
                        border: "5px solid black",
                    }}
                >
                    {/* HEADER (SAME AS AUTH) */}
                    <div
                        style={{
                            backgroundColor: settings?.header_color || "#1976d2",
                            padding: 20,
                            borderBottom: "3px solid black",
                            borderRadius: "5px 5px 0 0",
                            textAlign: "center",
                        }}
                    >
                        {settings?.logo_url && (
                            <img
                                src={`${API_ROOT}${settings.logo_url}`}
                                alt="Logo"
                                draggable="false"
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: "50%",
                                    border: "3px solid black",
                                    marginBottom: 10,
                                }}
                            />
                        )}
                        <Typography sx={{ color: "white", fontSize: 24, fontWeight: 600 }}>
                            {settings?.company_name || "Company Name"}
                        </Typography>
                        <Typography variant="body2" textAlign="center" sx={{ mb: 3, opacity: 0.8, userSelect: "none" }}>
                            {settings?.address || "Company Address"}
                        </Typography>
                        <Typography sx={{ color: "white", opacity: 0.8 }}>
                            Reset your password
                        </Typography>
                    </div>

                    {/* BODY */}
                    <div style={{ padding: "30px 28px 0" }}>
                        <div style={{ position: "relative", marginBottom: 20 }}>
                            <label style={{ fontWeight: 500, color: "rgba(0,0,0,0.6)" }}>
                                Email Address:
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                style={{
                                    width: "430px",
                                    padding: "13px 15px 12px 2.5rem",
                                    border: "2px solid black",
                                    borderRadius: 8,
                                    fontSize: 16,
                                }}
                            />
                            <EmailIcon
                                style={{
                                    position: "absolute",
                                    top: "2.1rem",
                                    left: "0.7rem",
                                    color: "rgba(0,0,0,0.4)",
                                }}
                            />
                        </div>

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ height: 45, mb: 3, mt: 8 }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </Button>

                        <Typography
                            onClick={goBack}
                            sx={{
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: 500,
                                color: "#000",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Back to Login
                        </Typography>
                    </div>

                    <div className="Footer" style={{ padding: "16px 12px", textAlign: "center", fontSize: "15px", color: "rgba(0,0,0,0.6)", backgroundColor: "rgba(243, 219, 173, 0.531)", borderRadius: "0px 0px 10px 10px", marginTop: "15px", width: "100%", boxSizing: "border-box", overflowWrap: "break-word", wordBreak: "break-word" }}>
                        <div className="FooterText" style={{ userSelect: "none" }}>
                            &copy; {new Date().getFullYear()} {settings?.company_name || "Barangay"} Student Information System. All rights reserved.
                        </div>
                    </div>
                </div>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
