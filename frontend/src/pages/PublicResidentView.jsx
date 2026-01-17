import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Divider,
    CircularProgress,
} from "@mui/material";
import apiPublic from "../apiPublic";
import API_BASE_URL from '../ApiConfig';

export default function PublicResidentView() {
    const getInitialCode = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("code") || "";
    };

    const getInitialTypes = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("types") || "";
    };

    const getInitialIssuedDate = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("issued") || "";
    };

    const [residentCode, setResidentCode] = useState(getInitialCode());
    const [documentTypes, setDocumentTypes] = useState(getInitialTypes());
    const [issuedDate, setIssueDate] = useState(getInitialIssuedDate());
    const [resident, setResident] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchResident = async (code, types, issued) => {
        const cleaned = code.trim();
        const cleanedDate = code.trim();
        if (!cleaned) return;

        setLoading(true);
        setError("");
        setResident(null);

        try {
            const res = await apiPublic.get(`/api/public/resident/${cleaned}/${types}/${issued}`);
            setResident(res.data);
        } catch (err) {
            console.error(err);
            setError("Resident not found.");
        } finally {
            setLoading(false);
        }
    };

    const fetchResidentInfo = async (code) => {
        const cleaned = code.trim();
        if (!cleaned) return;

        setLoading(true);
        setError("");
        setResident(null);

        try {
            const res = await apiPublic.get(`/api/public/resident/${cleaned}`);
            setResident(res.data);
        } catch (err) {
            console.error(err);
            setError("Resident not found.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!residentCode.trim()) return;

        if (documentTypes && issuedDate) {
            // QR with document info
            fetchResident(residentCode, documentTypes, issuedDate);
        } else {
            // QR with resident only
            fetchResidentInfo(residentCode);
        }
    }, [residentCode, documentTypes, issuedDate]);

    useEffect(() => {
        if (residentCode.trim()) {
            fetchResidentInfo(residentCode);
        }
    }, [residentCode]);

    const nowInSeconds = () => Math.floor(Date.now() / 1000);

    const secondsToFullDate = (seconds) => {
        const date = new Date(seconds * 1000);

        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    let expirationDate = "N/A";

    if (resident?.valid_until) {
        const validUntilSeconds = Number(resident.valid_until);

        if (!Number.isNaN(validUntilSeconds)) {
            const remainingSeconds = validUntilSeconds - nowInSeconds();

            expirationDate =
            remainingSeconds > 0
                ? secondsToFullDate(validUntilSeconds)
                : "Expired";
        } else {
            expirationDate = "Invalid date";
        }
    }

    return (
        <Box
            sx={{

                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                py: 4,
                height: "calc(100vh - 150px)",
                overflowY: "auto"
            }}
        >
            <Paper sx={{ width: "100%", maxWidth: 900, p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Resident Information (View Only)
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Scan a QR code or enter the resident code to view resident details.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* SEARCH BAR */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                        label="Resident Code"
                        placeholder="YYYY-00000"
                        value={residentCode}
                        onChange={(e) => setResidentCode(e.target.value)}
                        fullWidth
                    />

                    {documentTypes && issuedDate ? (
                        <Button
                            variant="contained"
                            onClick={() =>
                                fetchResident(residentCode, documentTypes, issuedDate)
                            }
                        >
                            Search
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => fetchResidentInfo(residentCode)}
                        >
                            Search
                        </Button>
                    )}
                </Box>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {resident && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                                    <img
                                        src={
                                            resident.profile_picture
                                                ? `${API_BASE_URL}${resident.profile_picture}` // correct full backend URL
                                                : "https://placehold.co/150x150"
                                        }
                                        alt="Resident"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "3px solid black",
                                        }}
                                    />

                                </Box>

                                <Divider sx={{ my: 3 }} />
                                <Typography>
                                    <b>Resident Code:</b> {resident.resident_code}
                                </Typography>
                                <Typography>
                                    <b>Full Name:</b> {resident.last_name},{" "}
                                    {resident.first_name} {resident.middle_name}
                                </Typography>
                                <Typography>
                                    <b>Sex:</b> {resident.sex}
                                </Typography>
                                <Typography>
                                    <b>Birthdate:</b> {resident.birthdate}
                                </Typography>
                                <Typography>
                                    <b>Age:</b> {resident.age}
                                </Typography>
                                <Typography>
                                    <b>Civil Status:</b> {resident.civil_status}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography>
                                    <b>Contact No:</b> {resident.contact_no}
                                </Typography>
                                <Typography>
                                    <b>Address:</b> {resident.address}
                                </Typography>
                                <Typography>
                                    <b>Purok:</b> {resident.purok}
                                </Typography>
                                <Typography>
                                    <b>Voter:</b>{" "}
                                    {resident.is_voters ? "Yes" : "No"}
                                </Typography>
                                <Typography>
                                    <b>PWD:</b> {resident.is_pwd ? "Yes" : "No"}
                                </Typography>
                                <Typography>
                                    <b>Status:</b>{" "}
                                    {resident.status ? "Alive" : "Deceased"}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography fontWeight="bold">
                                    Emergency Contact
                                </Typography>
                                <Typography>
                                    <b>Name:</b> {resident.fullname_emergency}
                                </Typography>
                                <Typography>
                                    <b>Contact No:</b>{" "}
                                    {resident.contact_no_emergency}
                                </Typography>
                            </Grid>
                            {documentTypes && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography fontWeight="bold">
                                        Document Requested
                                    </Typography>
                                    <Typography>
                                        <b>Document Name:</b> {resident.document_types}
                                    </Typography>
                                    <Typography>
                                        <b>Expire At:</b> {expirationDate}
                                    </Typography>
                                </Grid>
                            )}   

                        </Grid>
                    </>
                )}
            </Paper>
        </Box>
    );
}