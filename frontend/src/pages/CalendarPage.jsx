import React, { useEffect, useState, useContext } from "react";
import { SettingsContext } from "../App";
import {
    Box,
    Button,
    Card,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Snackbar,
    Alert,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../api";
import axios from "axios";


export default function CalendarPage() {
    const { settings } = useContext(SettingsContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [openImage, setOpenImage] = useState(null);

    const [events, setEvents] = useState([]);
    const [dayEvents, setDayEvents] = useState([]);

    const [eventId, setEventId] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [images, setImages] = useState([]);


    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState(null);
    const [deleteEventTitle, setDeleteEventTitle] = useState("");

    const confirmDeleteEvent = (id, title) => {
        setDeleteEventId(id);
        setDeleteEventTitle(title);
        setDeleteDialogOpen(true);
    };

    const [snack, setSnack] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message, severity = "success") => {
        setSnack({
            open: true,
            message,
            severity,
        });
    };


    // -----------------------------
    // FORMAT TIME TO AM / PM
    // -----------------------------
    const formatTimeAMPM = (time) => {
        if (!time) return "";

        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12; // convert 0 → 12
        return `${hour}:${minute} ${ampm}`;
    };


    // -----------------------------
    // PH Date Format
    // -----------------------------
    const formatDatePH = (dateObj) => {
        return dateObj.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
    };

    // -----------------------------
    // LOAD EVENTS ON START
    // -----------------------------
    useEffect(() => {
        loadEvents();
    }, []);

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

    const loadEvents = async () => {
        try {
            const res = await api.get("/events");

            // NORMALIZE DATES
            const list = res.data.map(ev => ({
                ...ev,
                start_date: ev.start_date?.split("T")[0],
                end_date: ev.end_date?.split("T")[0],
            }));

            setEvents(list);

            if (selectedDate) {
                const d = formatDatePH(selectedDate);
                setDayEvents(list.filter(ev => ev.start_date === d));
            }

        } catch (err) {
            console.error("Load events error:", err);
            setEvents([]);
            setDayEvents([]);
        }
    };

    const [holidays, setHolidays] = useState({});
    const year = currentMonth.getFullYear();

    const getHoliday = (date) => {
        if (!date) return null;
        const key = formatDatePH(date);
        return holidays[key] || null;
    };

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await axios.get(
                    `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`
                );
                const lookup = {};
                res.data.forEach((h) => {
                    lookup[h.date] = h;
                });
                setHolidays(lookup);
            } catch (err) {
                console.error("❌ Failed to fetch PH holidays:", err);
                setHolidays({});
            }
        };
        fetchHolidays();
    }, [year]);


    // -----------------------------
    // GENERATE CALENDAR
    // -----------------------------
    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

    const getCalendarDays = () => {
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        const num = daysInMonth(y, m);
        const first = new Date(y, m, 1).getDay();

        const arr = [];
        for (let i = 0; i < first; i++) arr.push(null);
        for (let d = 1; d <= num; d++) arr.push(new Date(y, m, d));

        return arr;
    };

    // -----------------------------
    // CHECK EVENTS
    // -----------------------------
    const hasEvent = (date) => {
        if (!date) return false;
        const d = formatDatePH(date);
        return events.some(ev => ev.start_date === d);
    };

    // -----------------------------
    // CLICK DATE
    // -----------------------------

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogDate, setDialogDate] = useState("");

    const handleDateClick = (date) => {
        if (!date) return;

        const d = formatDatePH(date);
        setSelectedDate(date);
        setDialogDate(date.toDateString());

        const filtered = events.filter(ev => ev.start_date === d);
        setDayEvents(filtered);

        setOpenDialog(true); // SHOW DIALOG
    };


    // -----------------------------
    // SAVE EVENT (CREATE OR UPDATE)
    // -----------------------------
    const saveEvent = async () => {
        if (!selectedDate) {
            showSnackbar("Please select a date first", "warning");
            return;
        }

        if (!eventTitle.trim()) {
            showSnackbar("Event title is required", "warning");
            return;
        }


        const token = localStorage.getItem("token");
        const dateStr = formatDatePH(selectedDate);

        try {
            let newId = eventId;

            // CREATE EVENT
            if (!eventId) {
                const res = await api.post(
                    "/events",
                    {
                        title: eventTitle,
                        description: eventDescription,
                        start_date: dateStr,
                        end_date: dateStr,
                        start_time: startTime,
                        end_time: endTime,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                newId = res.data.id;
                await AuditMyAction(`Added a new event ${eventTitle} in Event Page`);
            }

            // UPDATE EVENT
            else {
                await api.put(
                    `/events/${eventId}`,
                    {
                        title: eventTitle,
                        description: eventDescription,
                        start_date: dateStr,
                        end_date: dateStr,
                        start_time: startTime,
                        end_time: endTime,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                await AuditMyAction(`Updated an event ${eventTitle} in Event Page`);
            }

            // UPLOAD IMAGES
            if (images.length > 0 && newId) {
                const fd = new FormData();
                images.forEach((f) => fd.append("images", f));
                await api.post(`/events/${newId}/images`, fd, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            // RELOAD EVENTS
            const reload = await api.get("/events");

            const list = reload.data.map(ev => ({
                ...ev,
                start_date: ev.start_date?.split("T")[0],
            }));

            setEvents(list);

            setDayEvents(list.filter(ev => ev.start_date === dateStr));

            resetForm();

        } catch (err) {
            console.error("Save event error:", err);
            showSnackbar("Failed to save event", "error");

        }
    };

    const resetForm = () => {
        setEventId(null);
        setEventTitle("");
        setEventDescription("");
        setStartTime("");
        setEndTime("");
        setImages([]);
        setSelectedDate(null);
        setDayEvents([]);
        setOpenDialog(false); // ✅ IMPORTANT

        showSnackbar(
            eventId ? "Event updated successfully" : "Event created successfully",
            "success"
        );
    };


    // -----------------------------
    // EDIT EVENT
    // -----------------------------
    const editEvent = (ev) => {
        setEventId(ev.id);
        setEventTitle(ev.title || "");
        setEventDescription(ev.description || "");
        setStartTime(ev.start_time || "");
        setEndTime(ev.end_time || "");

        const dt = new Date(ev.start_date + "T00:00:00");
        setSelectedDate(dt);
        setDayEvents(events.filter(e => e.start_date === ev.start_date));

        setImages([]);        // reset upload list
        setOpenDialog(true);  // ✅ IMPORTANT
    };

    // -----------------------------
    // DELETE EVENT
    // -----------------------------
    const deleteEvent = async (id) => {
        const token = localStorage.getItem("token");

        try {
            await api.delete(`/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await AuditMyAction(`Deleted an event ${id} in Event Page`);

            showSnackbar("Event deleted successfully", "success");
            loadEvents();
        } catch (err) {
            console.error("Delete error:", err);
            showSnackbar("Failed to delete event", "error");
        }
    };


    // -----------------------------
    // CHANGE MONTH
    // -----------------------------
    const changeMonth = (offset) => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)

        );
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


    // ---------------------------------------------------
    // UI
    // ---------------------------------------------------
    return (

        <Box sx={{ p: 1, pr: 4, height: "calc(100vh - 150px)", overflowY: "auto" }}>
            {/* PAGE TITLE */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "times new roman", fontSize: "36px" }}>
                    EVENTS CALENDAR
                </Typography>
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    width: "100%",
                    flexGrow: 1,
                }}
            >
                {/* LEFT PANEL */}
                <Card
                    sx={{
                        flex: "0 0 35%",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        border: "2px solid black",
                        height: "100%",
                    }}
                >
                    {/* HEADER */}
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {eventId ? "Edit Event" : "Create Event"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {selectedDate ? selectedDate.toDateString() : "Select a date from calendar"}
                        </Typography>

                        {eventId && (
                            <Typography
                                sx={{
                                    mt: 1,
                                    display: "inline-block",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: "#fff3cd",
                                    color: "#856404",
                                    fontSize: 12,
                                }}
                            >
                                Editing mode
                            </Typography>
                        )}
                    </Box>

                    {/* EVENT DETAILS */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Event Details
                        </Typography>

                        <TextField
                            label="Event Title"
                            placeholder="Meeting, Birthday, Appointment..."
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Description"
                            placeholder="Optional notes"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>

                    {/* TIME */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Time
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Start"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="End"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </Box>

                    {/* PHOTOS */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Photos
                        </Typography>

                        <Button variant="outlined" component="label">
                            Upload Images
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages([...e.target.files])}
                            />

                        </Button>

                        {images.length > 0 && (
                            <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                                {images.length} file(s) selected
                            </Typography>
                        )}
                    </Box>

                    {/* ACTIONS */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={saveEvent}
                        >
                            {eventId ? "Update Event" : "Save Event"}
                        </Button>

                        {eventId && (
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>

                    {/* EVENTS LIST */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Events for this day
                        </Typography>

                        {dayEvents.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No events scheduled.
                            </Typography>
                        ) : (
                            <List dense>
                                {dayEvents.map((ev) => (
                                    <ListItem sx={{ border: "2px solid black" }}
                                        key={ev.id}
                                        secondaryAction={
                                            <Box sx={{ display: "flex", gap: 1, }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "green",
                                                        color: "white",
                                                        width: "80px",
                                                    }}
                                                    onClick={() => editEvent(ev)}
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
                                                    onClick={() => confirmDeleteEvent(ev.id, ev.title)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>

                                        }
                                    >
                                        <ListItemText
                                            primary={ev.title}
                                            secondary={`${formatTimeAMPM(ev.start_time)}${ev.end_time ? " – " + formatTimeAMPM(ev.end_time) : ""
                                                }`}

                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Card>


                <Card
                    sx={{
                        width: "70%",
                        p: 3,
                        border: "2px solid black",
                    }}
                >
                    {/* TABLE HEADER INSIDE CARD */}
                    <TableContainer
                        component={Paper}
                        sx={{
                            width: "100%",
                            mb: 2,
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
                                        CALENDAR
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    {/* MONTH NAVIGATION */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => changeMonth(-1)}
                        >
                            Prev
                        </Button>

                        <Typography variant="h5">
                            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                            {currentMonth.getFullYear()}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => changeMonth(1)}
                        >
                            Next
                        </Button>
                    </Box>

                    {/* CALENDAR GRID */}
                    <Grid container spacing={1}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <Grid size={{ xs: 12 / 7 }} key={d}>
                                <Typography
                                    sx={{ textAlign: "center", fontWeight: "bold", border: "2px solid black" }}
                                >
                                    {d}
                                </Typography>
                            </Grid>
                        ))}

                        {getCalendarDays().map((date, idx) => {
                            const holiday = getHoliday(date);
                            const hasEvt = hasEvent(date);

                            return (
                                <Grid size={{ xs: 12 / 7 }} key={idx}>
                                    <Box
                                        onClick={() => date && handleDateClick(date)}
                                        sx={{
                                            height: 90,
                                            borderRadius: 2,
                                            p: 1,
                                            textAlign: "center",
                                            cursor: date ? "pointer" : "default",
                                            bgcolor: holiday
                                                ? "#fdecea"     // holiday
                                                : hasEvt
                                                    ? "#c8f7c8" // event
                                                    : "#fafafa",
                                            border:
                                                selectedDate &&
                                                    date &&
                                                    formatDatePH(date) === formatDatePH(selectedDate)
                                                    ? "2px solid #1976d2"
                                                    : holiday
                                                        ? "2px solid #c62828"
                                                        : hasEvt
                                                            ? "2px solid #2e7d32"
                                                            : "2px solid #000",
                                        }}
                                    >
                                        {date && (
                                            <>
                                                {/* DAY NUMBER */}
                                                <Typography fontWeight="bold">
                                                    {date.getDate()}
                                                </Typography>

                                                {/* HOLIDAY NAME */}
                                                {holiday && (
                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            color: "#c62828",
                                                            fontWeight: "bold",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                        title={holiday.localName}
                                                    >
                                                        {holiday.localName}
                                                    </Typography>
                                                )}

                                                {/* EVENT PREVIEW */}
                                                {hasEvt &&
                                                    (() => {
                                                        const dayList = events.filter(
                                                            (ev) =>
                                                                ev.start_date === formatDatePH(date)
                                                        );

                                                        return (
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 11,
                                                                    mt: 0.5,
                                                                    color: "#2e7d32",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                }}
                                                            >
                                                                {dayList[0]?.title}
                                                                {dayList.length > 1 && " + more"}
                                                            </Typography>
                                                        );
                                                    })()}
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            );
                        })}

                    </Grid>
                </Card>

            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Events on {dialogDate}</DialogTitle>

                <DialogContent dividers>
                    {dayEvents.length === 0 && (
                        <Typography>No events on this date.</Typography>
                    )}

                    {dayEvents.map((ev) => (
                        <Card key={ev.id} sx={{ p: 2, mb: 2, border: "2px solid black" }}>
                            <Typography variant="h6">{ev.title}</Typography>
                            <Typography>{ev.description}</Typography>

                            <Typography sx={{ mt: 1 }}>
                                Time: {formatTimeAMPM(ev.start_time)} — {formatTimeAMPM(ev.end_time)}
                            </Typography>

                            {/* IMAGES */}
                            {ev.images && ev.images.length > 0 && (
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                    {ev.images.map((img) => (
                                        <img
                                            key={img.id}
                                            src={`http://localhost:5000${img.image_path}`}
                                            onClick={() =>
                                                setOpenImage(`http://localhost:5000${img.image_path}`)
                                            }
                                            style={{
                                                width: 120,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                            }}
                                        />
                                    ))}

                                </Box>
                            )}

                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: "green",
                                        color: "white",
                                        width: "80px",
                                        "&:hover": {
                                            backgroundColor: "#0b7a0b",
                                        },
                                    }}
                                    onClick={() => editEvent(ev)}
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
                                            backgroundColor: "#7c0000",
                                        },
                                    }}
                                    onClick={() => confirmDeleteEvent(ev.id, ev.title)} // ✅ show confirmation dialog first
                                >
                                    Delete
                                </Button>

                            </Box>

                        </Card>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{ backgroundColor: "black", color: "white" }}
                        onClick={() => setOpenDialog(false)}
                    >
                        Close
                    </Button>
                </DialogActions>


            </Dialog>

            <Dialog
                open={Boolean(openImage)}
                onClose={() => setOpenImage(null)}
                fullScreen
                PaperProps={{
                    sx: {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                    },
                }}
            >
                {/* TRANSPARENT CLICK-TO-CLOSE BACKDROP */}
                <Box
                    onClick={() => setOpenImage(null)}
                    sx={{
                        position: "fixed",
                        inset: 0,
                        cursor: "zoom-out",
                        backgroundColor: "rgba(0,0,0,0.15)", // 🔹 transparent, not black
                        zIndex: 1,
                    }}
                />

                {/* CLOSE BUTTON (CIRCLE) */}
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenImage(null);
                    }}
                    sx={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        width: 44,
                        height: 44,
                        borderRadius: "50%", // 🔵 literal circle
                        backgroundColor: "rgba(255,255,255,0.9)",
                        fontSize: 20,
                        fontWeight: "bold",
                        zIndex: 3,
                        "&:hover": {
                            backgroundColor: "white",
                        },
                    }}
                >
                    ✕
                </IconButton>

                {/* IMAGE CONTAINER */}
                <Box
                    onClick={(e) => e.stopPropagation()} // 🛑 image does NOT close dialog
                    sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        pointerEvents: "none",
                    }}
                >
                    <img
                        src={openImage}
                        alt="Event Preview"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            objectFit: "contain",
                            pointerEvents: "auto",
                            cursor: "default",
                        }}
                    />
                </Box>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnack((prev) => ({ ...prev, open: false }))
                }
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the event "{deleteEventTitle}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!deleteEventId) return;

                            const token = localStorage.getItem("token");

                            try {
                                await api.delete(`/events/${deleteEventId}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });

                                await AuditMyAction(`Deleted an event ${deleteEventTitle} in Event Page`);

                                showSnackbar("Event deleted successfully", "success");
                                loadEvents();
                            } catch (err) {
                                console.error("Delete error:", err);
                                showSnackbar("Failed to delete event", "error");
                            } finally {
                                setDeleteDialogOpen(false);
                                setDeleteEventId(null);
                                setDeleteEventTitle("");
                            }
                        }}
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>




        </Box >




    );
}
