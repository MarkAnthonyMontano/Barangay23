import React, { useEffect, useState, useContext, useMemo } from "react";
import { SettingsContext } from "../App";
import api from "../api";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TextField,
    MenuItem,
    Grid,
    Button,
} from "@mui/material";

const roleOptions = ["SuperAdmin", "Admin", "User"];

const AuditPage = () => {
    const { settings } = useContext(SettingsContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [actorFilter, setActorFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 100; // MAX rows per page

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            const res = await api.get("/audit_logs");
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch audit logs", err);
        } finally {
            setLoading(false);
        }
    };

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [actorFilter, roleFilter, fromDate, toDate]);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const logTime = new Date(log.created_at).getTime();

            const matchActor =
                actorFilter === "" ||
                log.actor_name.toLowerCase().includes(actorFilter.toLowerCase());

            const matchRole = roleFilter === "" || log.role === roleFilter;

            let matchDate = true;

            if (fromDate) {
                matchDate = logTime >= new Date(fromDate).getTime();
            }

            if (matchDate && toDate) {
                matchDate = logTime <= new Date(toDate).getTime();
            }

            return matchActor && matchRole && matchDate;
        });
    }, [logs, actorFilter, roleFilter, fromDate, toDate]);

    const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

    const paginatedLogs = filteredLogs.slice(

        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

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
                    HISTORY LOGS
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
                                Filter History Logs
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <Paper sx={{ p: 2, mb: 2, border: "2px solid black", }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Search Actor Name"
                            fullWidth
                            value={actorFilter}
                            sx={{ height: "55px", width: "223px" }}
                            onChange={(e) => setActorFilter(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            label="Filter by Role"
                            fullWidth
                            sx={{ height: "55px", width: "223px" }}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            {roleOptions.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            label="From"
                            type="datetime-local"
                            sx={{ height: "55px", width: "223px" }}
                            fullWidth
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            label="To"
                            type="datetime-local"
                            sx={{ height: "55px", width: "223px" }}
                            fullWidth
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <Paper elevation={3}>
                {loading ? (
                    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : paginatedLogs.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography>No matching audit logs</Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: settings?.header_color || "#1976d2",

                                }}>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: "center", border: "2px solid black", color: "#fff" }}><b>#</b></TableCell>
                                        <TableCell sx={{ textAlign: "center", border: "2px solid black", color: "#fff" }}><b>Actor</b></TableCell>
                                        <TableCell sx={{ textAlign: "center", border: "2px solid black", color: "#fff" }}><b>Role</b></TableCell>
                                        <TableCell sx={{ textAlign: "center", border: "2px solid black", color: "#fff" }}><b>Action</b></TableCell>
                                        <TableCell sx={{ textAlign: "center", border: "2px solid black", color: "#fff" }}><b>Date & Time</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedLogs.map((log, index) => (
                                        <TableRow key={log.id} hover>
                                            <TableCell sx={{ textAlign: "left", border: "2px solid black", color: "#000" }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                                            <TableCell sx={{ textAlign: "left", border: "2px solid black", color: "#000" }}>{log.actor_name}</TableCell>
                                            <TableCell sx={{ textAlign: "left", border: "2px solid black", color: "#000" }}>{log.role}</TableCell>
                                            <TableCell sx={{ textAlign: "left", border: "2px solid black", color: "#000" }}>{log.message}</TableCell>
                                            <TableCell sx={{ textAlign: "left", border: "2px solid black", color: "#000" }}>
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination Buttons - bottom right */}
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
        </Box>
    );
};

export default AuditPage;
