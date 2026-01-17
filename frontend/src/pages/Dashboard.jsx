import React, { useEffect, useState, useContext } from "react";
import { SettingsContext } from "../App";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Pie,
  Cell,
  PieChart,
  Legend,
} from "recharts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ManOutlinedIcon from "@mui/icons-material/ManOutlined";
import WomanOutlinedIcon from "@mui/icons-material/WomanOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import HeartBrokenOutlinedIcon from "@mui/icons-material/HeartBrokenOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);
import API_BASE_URL from "../ApiConfig";
import api from "../api";

const API_ROOT = `${API_BASE_URL}`;

const ResidentsDashboard = () => {
  const { settings } = useContext(SettingsContext);
  const [residents, setResidents] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [household, setHousehold] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [holidays, setHolidays] = useState([]);
  const [showPicker, setShowPicker] = React.useState(false);
  const [events, setEvents] = useState([]);
  const [eventImages, setEventImages] = useState([]);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const today = dayjs();

  useEffect(() => {
    fetchResidents();
    fetchPendingRequest();
    fetchIncidents();
    fetchReceipts();
  }, []);

  useEffect(() => {
    fetchHouseHold();
    fetchServices();
  }, [selectedYear]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events-display");
        setEvents(res.data.events || []);
        setEventImages(res.data.images || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const eventsWithImages = events.map((event) => ({
    ...event,
    images: eventImages.filter((img) => img.event_id === event.id),
  }));

  const fetchResidents = async () => {
    const res = await api.get("/residents");
    setResidents(res.data);
  };

  const fetchPendingRequest = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/print-requests/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPendingRequest(res.data);
    } catch (err) {
      console.error("Failed to load pending requests", err);
    }
  };

  const [services, setServices] = useState([]);

  const fetchHouseHold = async () => {
    const res = await api.get("/households/dashboard", {
      params: { year: selectedYear },
    });
    setHousehold(res.data.households || []);
  };

  const fetchServices = async () => {
    const res = await api.get("/services/dashboard", {
      params: { year: selectedYear },
    });
    setServices(res.data.services || []);
  };

  const fetchIncidents = async () => {
    const res = await api.get("/incidents");
    setIncidents(res.data || []);
  };

  const fetchReceipts = async () => {
    const res = await api.get("/receipts");
    setReceipts(res.data || []);
  };

  useEffect(() => {
    fetchHolidays(currentMonth.year());
  }, [currentMonth]);

  const fetchHolidays = async (year) => {
    try {
      const res = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`
      );
      const data = await res.json();
      setHolidays(data);
    } catch (err) {
      console.error("Holiday fetch failed", err);
    }
  };

  const holidayMap = holidays.reduce((acc, h) => {
    acc[h.date] = h.localName;
    return acc;
  }, {});

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.startOf("week");
  const endDay = endOfMonth.endOf("week");

  const days = [];
  let day = startDay;

  while (day.isBefore(endDay, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const months = dayjs.months();
  const START_YEAR = 2010;
  const years = Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );

  const filteredResidents =
    selectedYear === "all"
      ? residents
      : residents.filter((r) => {
        const year = new Date(r.created_at).getFullYear();
        return year === selectedYear;
      });

  const filteredIncidents =
    selectedYear === "all"
      ? incidents
      : incidents.filter((i) => {
        const year = new Date(i.created_at).getFullYear();
        return year === selectedYear;
      });

  const filteredHousehold =
    selectedYear === "all"
      ? household
      : household.filter((h) => {
        const year = new Date(h.created_at).getFullYear();
        return year === selectedYear;
      });

  const filteredRequest =
    selectedYear === "all"
      ? pendingRequest
      : pendingRequest.filter((p) => {
        const year = new Date(p.created_at).getFullYear();
        return year === selectedYear;
      });

  const filteredReceipt =
    selectedYear === "all"
      ? receipts
      : receipts.filter((p) => {
        const year = new Date(p.date).getFullYear();
        return year === selectedYear;
      });

  const [selectedMonthReceipt, setSelectedMonthReceipt] = useState(
    dayjs().format("YYYY-MM")
  );

  const filteredReceiptByMonth = receipts.filter((receipt) => {
    if (!receipt.date) return false;
    return dayjs(receipt.date).format("YYYY-MM") === selectedMonthReceipt;
  });

  const livingToMonths = (living) => {
    if (!living) return 0;

    const text = living.toLowerCase();

    let years = 0;
    let months = 0;

    const yearMatch = text.match(/(\d+)\s*(year|years|yr|yrs)/);
    const monthMatch = text.match(/(\d+)\s*(month|months|mo|mos)/);

    if (yearMatch) years = parseInt(yearMatch[1], 10);
    if (monthMatch) months = parseInt(monthMatch[1], 10);

    return years * 12 + months;
  };

  /* ================= CALCULATIONS ================= */
  const totalPopulation = filteredResidents.length;
  const totalPendingRequest = filteredRequest.length;
  const totalHousehold = household.length;

  const maleCount = filteredResidents.filter((r) => r.sex === "Male").length;
  const femaleCount = filteredResidents.filter(
    (r) => r.sex === "Female"
  ).length;
  const voterCount = filteredResidents.filter(
    (r) => Number(r.is_voters) === 1
  ).length;
  const nonVoterCount = filteredResidents.filter(
    (r) => Number(r.is_voters) === 0
  ).length;
  const aliveCount = filteredResidents.filter(
    (r) => Number(r.status) === 1
  ).length;
  const deceasedCount = filteredResidents.filter(
    (r) => Number(r.status) === 0
  ).length;
  const pwdResidents = filteredResidents.filter((r) => Number(r.is_pwd) === 1);
  const totalServices = services.length;
  const residentsCount = filteredResidents.filter(
    (r) => livingToMonths(r.living) >= 6
  ).length;

  const nonResidentsCount = filteredResidents.filter(
    (r) => livingToMonths(r.living) < 6
  ).length;

  const incidentStatusMap = filteredIncidents.reduce((acc, incident) => {
    const status = incident.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const receiptPurposeMap = filteredReceipt.reduce((acc, receipt) => {
    const purpose = receipt.purpose || "Unknown";
    const amount = Number(receipt.amount) || 0;

    acc[purpose] = (acc[purpose] || 0) + amount;
    return acc;
  }, {});

  const receiptBarData = Object.entries(receiptPurposeMap).map(
    ([purpose, totalAmount]) => ({
      purpose,
      totalAmount,
    })
  );

  const monthlyReceiptMap = filteredReceipt.reduce((acc, receipt) => {
    const date = receipt.date;
    if (!date) return acc;

    // Extract month index (0–11)
    const monthIndex = new Date(date).getMonth();
    const amount = Number(receipt.amount) || 0;

    acc[monthIndex] = (acc[monthIndex] || 0) + amount;
    return acc;
  }, {});

  // Convert to array with month names
  const monthlyReceiptBarData = Array.from({ length: 12 }, (_, i) => ({
    month: dayjs().month(i).format("MMM"), // Jan, Feb, Mar
    totalAmount: monthlyReceiptMap[i] || 0,
  }));

  const incidentData = Object.entries(incidentStatusMap).map(
    ([name, count]) => ({ name, count })
  );

  const calculateAge = (birthdate) => {
    return dayjs().diff(dayjs(birthdate), "year");
  };

  const pwdBarData = [
    { name: "Child (0-12)", value: 0 },
    { name: "Minor (13-17)", value: 0 },
    { name: "Adult (18-59)", value: 0 },
    { name: "Senior (60+)", value: 0 },
  ];

  const ageDemographicData = [
    { name: "Child(0-12)", value: 0 },
    { name: "Minor(13-17)", value: 0 },
    { name: "Adult(18-59)", value: 0 },
    { name: "Senior(60+)", value: 0 },
  ];

  filteredResidents.forEach((resident) => {
    if (!resident.birthdate) return;

    const age = calculateAge(resident.birthdate);

    if (age <= 12) ageDemographicData[0].value++;
    else if (age <= 17) ageDemographicData[1].value++;
    else if (age <= 59) ageDemographicData[2].value++;
    else ageDemographicData[3].value++;
  });

  pwdResidents.forEach((resident) => {
    if (!resident.birthdate) return;
    const age = calculateAge(resident.birthdate);

    if (age <= 12) pwdBarData[0].value++;
    else if (age <= 17) pwdBarData[1].value++;
    else if (age <= 59) pwdBarData[2].value++;
    else pwdBarData[3].value++;
  });

  const pieData = ageDemographicData;
  const piePWDData = pwdBarData;

  const iconBoxBase = {
    height: 56,
    width: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
    borderRadius: "10px",
    border: "2px solid",
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [formattedDate, setFormattedDate] = React.useState(getFormattedDate());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(getFormattedDate());
    }, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        p: 1,
        pr: 2,
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              
              height: "140px",
              backgroundColor: "#fff9ec",
              border: "2px solid black",
              borderRadius: "12px",
              boxShadow: 3,
              px: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" flex={1}>
              {/* User Avatar */}
              <Avatar
                src={
                  user?.profile_image
                    ? `${API_BASE_URL}${user.profile_image}`
                    : undefined
                } // show user image if exists
                alt={user?.full_name || "User"}
                sx={{
                  width: 90,
                  height: 90,
                  border: "2px solid black",
                  mr: 2,
                }}
              >
                {!user?.profile_image && user?.full_name?.[0]}{" "}
                {/* fallback: first letter */}
              </Avatar>

              {/* User Info */}
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Welcome back, {user?.full_name || "User"}!
                </Typography>
                <Typography fontSize={18}>
                  <b>Role:</b> {user?.role || "N/A"}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-start"
              gap={2}
            >
              {/* Left side: Date + FormControl */}
              <Box textAlign="right">
                <Typography fontSize={20} fontWeight={500} mb={1}>
                  {formattedDate}
                </Typography>

                <FormControl
                  size="small"
                  sx={{ minWidth: 180, textAlign: "center" }}
                >
                  <InputLabel>Year</InputLabel>
                  <Select
                    label="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year} - {year + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Right side: Logo */}
              {settings?.logo_url && (
                <img
                  src={`${API_ROOT}${settings.logo_url}`}
                  alt="Barangay Logo"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      {/* ================= ROW 1 – MAIN STATS (FULL ROW) ================= */}
      <Grid container spacing={3} sx={{ mt: 2, mb: "5%" }}>
        <Grid container spacing={3} sx={{ mt: 3 }} direction="column">
          <Grid item xs={10} md={2}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#E3F2FD",
                height: "100px",
                p: 3,
                borderRadius: 3,

                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#90CAF9", // optional: different bg for icon
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,

                }}
              >
                <GroupsOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  TOTAL POPULATION
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalPopulation}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#E8F5E9", // light green background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,

                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#81C784", // green circle for residents
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <PeopleAltOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  RESIDENTS
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {residentsCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#E3F2FD", // light blue background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,

                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#64B5F6", // blue circle for male
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <ManOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NUMBER OF MALE
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {maleCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#FFF3E0", // light orange background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,

                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#FFB74D", // orange circle for registered voters
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <HowToVoteOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  REGISTERED VOTERS
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {voterCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid green",
                backgroundColor: "#C8E6C9", // light green background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                width: 280,
                color: "black",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid green",
                  backgroundColor: "green", // darker green for icon circle
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <FavoriteOutlinedIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NUMBER OF ALIVE
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {aliveCount}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid #006064",
                backgroundColor: "#B2EBF2",
                height: "100px",
                p: 3,
                width: 280,
                borderRadius: 3,
                color: "black",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid #006064",
                  backgroundColor: "#00838F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <MedicalServicesOutlinedIcon
                  sx={{ fontSize: 36, color: "#fff" }}
                />
              </Box>

              {/* Text */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  TOTAL SERVICES
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  {totalServices}
                </Typography>
              </Box>
            </Card>


          </Grid>
          <Grid item>
            <Card
              sx={{
                border: "2px solid black",
                borderRadius: 3,
                boxShadow: 3,
                height: 400,
                width: 530,
                mt: 2,
              }}
            >
              <CardContent sx={{ height: "90%" }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  MONTHLY BARANGAY INCOME
                </Typography>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyReceiptBarData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid vertical={false} strokeOpacity={0.1} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      axisLine={{ strokeOpacity: 0.2 }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${Number(value).toLocaleString()}`
                      }
                      tick={{ fontSize: 12, opacity: 0.7 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `₱${Number(value).toLocaleString()}`
                      }
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                        fontSize: 14,
                      }}
                    />
                    <Bar
                      dataKey="totalAmount"
                      barSize={32}
                      fill="#2E7D32"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }} direction="column">
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#FFEBEE", // light red background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                ml: -28,
                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#EF9A9A", // red circle for pending request
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <AssignmentOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  PENDING REQUEST
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalPendingRequest}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#FCE4EC", // light pink background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                ml: -28,
                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#F48FB1", // pink circle for non-residents
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <PersonOffOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NON-RESIDENTS
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {nonResidentsCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#FCE4EC", // light pink background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                ml: -28,
                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#F48FB1", // pink circle for female
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <WomanOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NUMBER OF FEMALE
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {femaleCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid black",
                backgroundColor: "#FFEBEE", // light red/pink background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                ml: -28,
                width: 280,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid black",
                  backgroundColor: "#EF9A9A", // red circle for non-voters
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <BlockOutlinedIcon sx={{ fontSize: 36, color: "#000" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NON-VOTERS
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {nonVoterCount}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid darkred",
                backgroundColor: "#FFCDD2", // light red background for the card
                height: "100px",
                p: 3,
                borderRadius: 3,
                ml: -28,
                width: 280,
                color: "black",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid darkred",
                  backgroundColor: "#C62828", // dark red circle for icon
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <HeartBrokenOutlinedIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>

              {/* Text Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  NUMBER OF DECEASED
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {deceasedCount}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "2px solid #1b5e20",
                backgroundColor: "#C8E6C9",
                height: "100px",
                p: 3,
                width: 280,
                ml: -28,
                borderRadius: 3,
                color: "black",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
              }}
            >
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid #1b5e20",
                  backgroundColor: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                }}
              >
                <HomeWorkOutlinedIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>

              {/* Text */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black" }}
                  fontSize={12}
                  fontWeight={600}
                >
                  TOTAL HOUSEHOLDS
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  {totalHousehold}
                </Typography>
              </Box>
            </Card>
          </Grid>

        </Grid>



        <Grid container spacing={3} sx={{ mt: 3,  }}>

          {/* LEFT COLUMN */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Events Calendar */}
              <Grid item>
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: 380,
                    width: 550,
                    boxShadow: 3,
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      backgroundColor: "#fff",
                      color: "black",
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      fontSize: 18,
                      textAlign: "center",
                      borderBottom: "2px solid black",
                    }}
                  >
                    Events Calendar
                  </Box>

                  {/* Content */}
                  <CardContent
                    sx={{
                      width: "100%",
                      height: "calc(100% - 56px)", // subtract header height
                      p: 0,
                      bgcolor: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {eventsWithImages.length === 0 ? (
                      <Box
                        sx={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9e9e9e",
                          textAlign: "center",
                          px: 3,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 18, fontWeight: 600, color: "#fff" }}
                        >
                          There’s No Event Existed
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14, opacity: 0.7, color: "#fff" }}
                        >
                          Please check back later for upcoming community events.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <EventSlideshow events={eventsWithImages} />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Age Demographic Pie Chart */}
              <Grid item>
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: 350,
                    width: 550,
                    boxShadow: 3,
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#1976D2",
                      color: "white",

                      fontWeight: 600,
                      fontSize: 16,
                      borderBottom: "2px solid black",
                      textAlign: "center",
                    }}
                  >
                    AGE DEMOGRAPHIC
                  </Box>
                  <CardContent
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "95%",
                        height: "93%",
                        border: "2px solid black",
                        borderRadius: "10px",
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="55%"
                            cy="50%"
                            outerRadius="75%"
                            label={(entry) => `${entry.name} - ${entry.value}`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={index}
                                fill={
                                  ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                                  index % 4
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Legend
                            verticalAlign="bottom"
                            height={40}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    boxShadow: 3,
                    height: 375,
                    width: 550,
                    ml: -8,
                    mt: 1,
               
                  }}
                >
                  <CardContent sx={{ height: "90%" }}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        mb: 2,
                        textAlign: "center",
                      }}
                    >
                      RECEIPTS BY PURPOSE
                    </Typography>

                    {receiptBarData.length === 0 ? (
                      <Typography
                        sx={{ textAlign: "center", color: "#9e9e9e", mt: 5 }}
                      >
                        No receipt data available
                      </Typography>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={receiptBarData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
                        >
                          <CartesianGrid vertical={false} strokeOpacity={0.1} />
                          <XAxis
                            dataKey="purpose"
                            tick={{ fontSize: 12, fontWeight: 600 }}
                            axisLine={{ strokeOpacity: 0.2 }}
                            tickLine={false}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12, opacity: 0.7 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fillOpacity: 0.08 }}
                            contentStyle={{
                              borderRadius: 12,
                              border: "none",
                              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                              fontSize: 14,
                            }}
                          />
                          <Bar
                            dataKey="totalAmount"
                            barSize={50}
                            fill="#1976D2"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* MIDDLE COLUMN */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Calendar */}
              <Grid item>
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    boxShadow: 3,
                    height: 380,

                    width: 380
                  }}
                >
                  <CardContent>
                    {/* HEADER + MONTH NAVIGATION */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Box
                          onClick={() =>
                            setCurrentMonth(currentMonth.subtract(1, "month"))
                          }
                          sx={{
                            cursor: "pointer",
                            fontSize: 20,
                            color: "#424242",
                            "&:hover": {
                              color: "#90caf9",
                              transform: "scale(1.2)",
                            },
                          }}
                        >
                          ❮
                        </Box>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            onClick={() => setShowPicker(!showPicker)}
                            sx={{
                              px: 2,
                              py: 0.6,
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontSize: 16,
                              bgcolor: "#f5f5f5",
                              color: "#212121",
                              "&:hover": {
                                bgcolor: "#e0e0e0",
                                boxShadow: "0 0 8px rgba(144,202,249,0.6)",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: "700",
                                fontSize: 16,
                                color: "#212121",
                                marginTop: "3px",
                              }}
                            >
                              {currentMonth.format("MMMM YYYY")}
                            </Typography>
                          </Box>

                          {showPicker && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: "110%",
                                border: "2px solid black",
                                left: "50%",
                                transform: "translateX(-50%)",
                                bgcolor: "white",
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 1,
                                zIndex: 10,
                                display: "flex",
                                gap: 1,
                              }}
                            >
                              <Select
                                size="small"
                                value={currentMonth.month()}
                                onChange={(e) =>
                                  setCurrentMonth(
                                    currentMonth.month(e.target.value)
                                  )
                                }
                              >
                                {months.map((m, i) => (
                                  <MenuItem key={i} value={i}>
                                    {m}
                                  </MenuItem>
                                ))}
                              </Select>
                              <Select
                                size="small"
                                value={currentMonth.year()}
                                onChange={(e) =>
                                  setCurrentMonth(
                                    currentMonth.year(e.target.value)
                                  )
                                }
                              >
                                {years.map((y) => (
                                  <MenuItem key={y} value={y}>
                                    {y}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>
                          )}
                        </Box>
                        <Box
                          onClick={() =>
                            setCurrentMonth(currentMonth.add(1, "month"))
                          }
                          sx={{
                            cursor: "pointer",
                            fontSize: 20,
                            color: "#424242",
                            "&:hover": {
                              color: "#90caf9",
                              transform: "scale(1.2)",
                            },
                          }}
                        >
                          ❯
                        </Box>
                      </Box>
                    </Box>

                    {/* DAYS */}
                    <Grid container columns={7} sx={{ mb: 1, textAlign: "center" }}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <Grid key={day} xs={1}>
                            <Typography
                              align="center"
                              fontWeight="700"
                              sx={{
                                fontSize: 14,
                                color: day === "Sun" ? "red" : "#616161",
                                width: "50px",
                                userSelect: "none",
                              }}
                            >
                              {day}
                            </Typography>
                          </Grid>
                        )
                      )}
                    </Grid>

                    <Grid container sx={{ width: "350px", margin: 0 }}>
                      {days.map((date, idx) => {
                        const fullDate = date.format("YYYY-MM-DD");
                        const isCurrentMonth =
                          date.month() === currentMonth.month();
                        const isWeekend = date.day() === 0 || date.day() === 6;
                        const isHoliday = holidayMap[fullDate];
                        const isToday = date.isSame(today, "day");

                        return (
                          <Grid key={idx} item xs={12 / 7}>
                            <Box
                              sx={{
                                height: 50,
                                width: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                cursor: "pointer",
                                bgcolor: isHoliday
                                  ? "#ffebee"
                                  : isToday
                                    ? "#e3f2fd"
                                    : "transparent",
                                color: isHoliday
                                  ? "red"
                                  : isWeekend
                                    ? "red"
                                    : "#212121",
                                opacity: isCurrentMonth ? 1 : 0.35,
                                "&:hover": {
                                  bgcolor: "#90caf9",
                                  color: "#0d47a1",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 3px 10px rgba(144,202,249,0.4)",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 15, fontWeight: 600 }}
                              >
                                {date.date()}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Comment ko muna ito pansamantala */}
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    boxShadow: 3,
                    height: 350,
                    width: 380,
                    mt: 3,
                  }}
                >
                  <CardContent sx={{ height: "90%" }}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        mb: 2,
                        textAlign: "center",
                      }}
                    >
                      INCIDENT REPORT
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={incidentData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} strokeOpacity={0.1} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}
                          axisLine={{ strokeOpacity: 0.2 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, opacity: 0.6 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fillOpacity: 0.08 }}
                          contentStyle={{
                            borderRadius: 12,
                            border: "none",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                            fontSize: 14,
                          }}
                        />
                        <Bar dataKey="count" barSize={80} fill="black" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card
                  sx={{
                    border: "2px solid black",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: 375,
                    ml: -6,
                    width: 430,
                    boxShadow: 3,
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#1976D2",
                      color: "white",

                      fontWeight: 600,
                      fontSize: 16,
                      borderBottom: "2px solid black",
                      textAlign: "center",
                    }}
                  >
                    PWD DEMOGRAPHIC
                  </Box>
                  <CardContent
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "95%",
                        height: "90%",
                        border: "2px solid black",
                        borderRadius: "10px",
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={piePWDData}
                            dataKey="value"
                            nameKey="name"
                            cx="55%"
                            cy="50%"
                            outerRadius="75%"
                            label={(entry) => `${entry.name} - ${entry.value}`}
                          >
                            {piePWDData.map((entry, index) => (
                              <Cell
                                key={index}
                                fill={
                                  ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                                  index % 4
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Legend
                            verticalAlign="bottom"
                            height={40}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>


            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

/* ================= SHARED STYLE ================= */
const EventSlideshow = ({ events }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = events.length;

  useEffect(() => {
    if (paused || total === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => clearInterval(timer);
  }, [paused, total]);

  if (total === 0) return null;

  const event = events[index];
  const image =
    event.images?.length > 0
      ? `http://localhost:5000${event.images[0].image_path}`
      : null;

  const truncate = (text, max = 120) =>
    text?.length > max ? text.slice(0, max) + "…" : text;

  return (
    <Box
      sx={{ height: "100%", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* IMAGE */}
      {image && (
        <Box
          component="img"
          src={image}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "390px",
            objectFit: "cover",
            transition: "opacity 0.8s ease",
          }}
        />
      )}

      {/* OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          height: "390px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
        }}
      />

      {/* CONTENT */}
      <Box
        sx={{
          position: "absolute",
          bottom: 25,
          left: 20,
          color: "#fff",
          maxWidth: "80%",
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.5 }}>
          {truncate(event.description)}
        </Typography>
      </Box>

      {/* ARROWS */}
      <Box
        onClick={() => setIndex((index - 1 + total) % total)}
        sx={arrowStyle("left")}
      >
        ❮
      </Box>

      <Box
        onClick={() => setIndex((index + 1) % total)}
        sx={arrowStyle("right")}
      >
        ❯
      </Box>

      {/* DOTS */}
      <Box
        sx={{
          position: "absolute",
          bottom: -10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {events.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "0.3s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: 12,
  transform: "translateY(-50%)",
  fontSize: 22,
  marginTop: "15px",
  color: "#fff",
  cursor: "pointer",
  zIndex: 5,
  opacity: 0.7,
  transition: "0.3s",
  "&:hover": {
    opacity: 1,
    transform: "translateY(-50%) scale(1.2)",
  },
});

export default ResidentsDashboard;
