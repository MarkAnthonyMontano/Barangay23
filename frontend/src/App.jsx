import React, { useEffect, useState, createContext, } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Tooltip,
  Divider,
  Drawer as MuiDrawer,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Home as HomeIcon,
  Report as ReportIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Groups as GroupsIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  Dashboard as DashboardIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { CalendarMonth as CalendarIcon } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';

// ========== Sidebar Items ==============
import Dashboard from "./pages/Dashboard";
import CertificatesPage from "./pages/CertificatesPage";
import ResidentsPage from "./pages/ResidentsPage";
import HouseholdsPage from "./pages/HouseholdsPage";
import IncidentsPage from "./pages/IncidentsPage";
import ServicesPage from "./pages/ServicesPage";
import AuthPage from "./components/AuthPage.jsx";
import OfficialsPage from "./pages/OfficialsPage";
import Settings from "./components/Settings";
import ResidentIDCard from "./pages/ResidentIDCard";
import CalendarPage from "./pages/CalendarPage";
import RequestPanel from "./pages/RequestPanel";
import AuditPage from "./pages/AuditPage";
import PublicResidentView from "./pages/PublicResidentView.jsx";

//========= Appbar Items (If the user is not login) ============
import AboutUs from "./components/AboutUs";
import ForgotPassword from "./components/ForgotPassword";
import AdminSecuritySettings from "./components/AdminSecuritySettings";

import { setAuthToken } from "./api.js";
import api from "./api";
import API_BASE_URL from "./ApiConfig.js";

export const SettingsContext = createContext(null);
const API_ROOT = `${API_BASE_URL}`;
const drawerWidth = 270;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export default function App() {

  const raw = window.location.href;

  // Get query params from normal URL OR hash URL
  let query = window.location.search;
  if (!query && raw.includes("?")) {
    query = "?" + raw.split("?")[1];
  }

  const params = new URLSearchParams(query);

  // PUBLIC VIEW MODE
  if (
    params.get("public") === "residentview" ||
    window.location.pathname.includes("residentview")
  ) {
    return <PublicResidentView />;
  }


  const [publicPage, setPublicPage] = useState("auth");

  const theme = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(drawerWidth);

  const [page, setPage] = useState(() => {
    return localStorage.getItem("currentPage") || "dashboard";
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      const MIN_WIDTH = 60;
      const MAX_WIDTH = drawerWidth;
      const BREAK_MIN = 600;
      const BREAK_MAX = 1400;

      let newWidth;

      if (width <= BREAK_MIN) {
        newWidth = MIN_WIDTH;
      } else if (width >= BREAK_MAX) {
        newWidth = MAX_WIDTH;
      } else {
        // Smooth linear interpolation
        const ratio = (width - BREAK_MIN) / (BREAK_MAX - BREAK_MIN);
        newWidth = MIN_WIDTH + ratio * (MAX_WIDTH - MIN_WIDTH);
      }

      setSidebarWidth(newWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/public/settings");

      // ✅ THIS IS THE MISSING PIECE
      localStorage.setItem(
        "company_settings",
        JSON.stringify(response.data)
      );

      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Failed to fetch user:", err);
      }
    }
  };


  useEffect(() => {
    if (!token) return;

    setAuthToken(token);
    fetchUser(); // ✅ LOAD USER FROM DB
  }, [token]);

  const handleLogin = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
  };


  const canAccess = (key) => user?.page_access?.includes(key);

  const renderPage = () => {
    if (!canAccess(page)) {
      return <Typography>You do not have access to this page.</Typography>;
    }
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "residents":
        return <ResidentsPage />;
      case "households":
        return <HouseholdsPage />;
      case "incidents":
        return <IncidentsPage />;
      case "services":
        return <ServicesPage />;
      case "certificates":
        return <CertificatesPage />;
      case "officials":
        return <OfficialsPage />;
      case "calendarpage":
        return <CalendarPage />;
      case "requestpanel":
        return <RequestPanel />;
      case "adminsecuritysettings":
        return <AdminSecuritySettings />;
      case "auditpage":
        return <AuditPage />;
      case "settings":
        return (
          <Settings
            settings={settings}
            onUpdate={fetchSettings}
          />
        );
      case "residentidcard":
        return <ResidentIDCard />;
      default:
        return <ResidentsPage />;
    }
  };



  if (!token || !user) {
    return (
      <Box
        style={{
          backgroundImage: settings?.bg_image
            ? `url(${API_ROOT}${settings.bg_image})`
            : "none",

          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-1rem",
          marginLeft: "-4rem",
        }}
      >
        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            padding: "0.5rem 0rem",
            backgroundColor: settings?.header_color || theme.palette.primary.main,
          }}
        >
          <Toolbar>
            {settings?.logo_url && (
              <img
                src={`${API_ROOT}${settings.logo_url}`}
                alt="Logo"
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 12,
                  border: "double 5px white",

                }}
                draggable="false"
              />
            )}
            <Box sx={{ flexGrow: 1 }} >
              <Typography variant="h6" sx={{ userSelect: "none", marginLeft: "1rem", fontWeight: "600", fontSize: "25px", letterSpacing: "3px" }}>
                {settings?.company_name.toUpperCase() || "COMPANY NAME"}
              </Typography>
              <Typography sx={{ marginLeft: "1rem", userSelect: "none", marginTop: "-10px", letterSpacing: "-1px" }}>
                Barangay Information System
              </Typography>
            </Box>
            {["auth", "about", "residentview"].map((item) => {
              if (item === "residentview") return null; // QR-only page

              return (
                <Typography
                  key={item}
                  onClick={() => setPublicPage(item)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: publicPage === item ? "bold" : "normal",
                    color: publicPage === item ? "#fff" : "rgba(255,255,255,0.8)",
                    position: "relative",
                    marginLeft: item === "auth" ? 0 : 3,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#fff",
                      transform: "scale(1.05)",
                    },

                    "&::after": {
                      content: '""',
                      display: publicPage === item ? "block" : "none",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "3px",
                      backgroundColor: "#fff",
                      borderRadius: "2px",
                    },
                  }}
                >
                  {item === "auth" ? "Home" : "About Us"}
                </Typography>
              );
            })}


          </Toolbar>
        </AppBar>

        {/* Main auth page */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ mt: 10, mb: 8 }}>
            {publicPage === "auth" && (
              <AuthPage
                onLogin={handleLogin}
                goForgotPassword={() => setPublicPage("forgotpassword")}
              />
            )}

            {publicPage === "about" && <AboutUs />}

            {publicPage === "forgotpassword" && (
              <ForgotPassword goBack={() => setPublicPage("auth")} />
            )}

            {publicPage === "residentview" && <PublicResidentView />}
          </Box>

        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 40,
            bgcolor: settings?.footer_color || theme.palette.primary.main,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            userSelect: "none"
          }}
        >
          © {new Date().getFullYear()} Barangay Information System — All Rights Reserved
        </Box>
      </Box>
    );
  }


  return (
    <SettingsContext.Provider value={{ settings, fetchSettings }}>
      <Box sx={{ display: "flex", height: "110vh" }}>
        <CssBaseline />

        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: settings?.header_color || theme.palette.primary.main, padding: "0.5rem 0rem",
          }}
        >

          <Toolbar>
            {settings?.logo_url && (
              <img
                src={`${API_ROOT}${settings.logo_url}`}
                alt="Logo"
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 12,
                  border: "2px solid white",
                  cursor: "pointer"
                }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} >
              <Typography variant="h6" sx={{ userSelect: "none", marginLeft: "1rem", fontWeight: "600", fontSize: "25px", letterSpacing: "3px" }}>
                {settings?.company_name.toUpperCase() || "COMPANY NAME"}
              </Typography>
              <Typography sx={{ userSelect: "none", marginLeft: "1rem", marginTop: "-10px", letterSpacing: "-1px" }}>
                Barangay Information System
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <MuiDrawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              transition: "width 0.28s ease",
              boxSizing: "border-box",
              borderRight: "3px solid black",
              mt: 8,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 150px)",
              overflowY: "auto",  // ← add this line
            },
          }}
        >
          {/* Profile Section */}
          <Tooltip
            title={sidebarWidth <= 100 ? `${user?.full_name} — ${user?.role}` : ""}
            placement="right"
            arrow
            slotProps={{
              tooltip: { sx: { fontSize: sidebarWidth <= 100 ? "1rem" : "0.75rem" } },
            }}
          >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mb: 2, mt: 5, transition: "all 0.25s ease" }}>
              <img
                src={user?.profile_image ? `${API_BASE_URL}${user.profile_image}` : "https://placehold.co/110x110"}
                alt="profile"
                style={{
                  borderRadius: "50%",
                  border: "solid black 3px",
                  width: sidebarWidth <= 110 ? 60 : 110,
                  height: sidebarWidth <= 110 ? 60 : 110,
                  objectFit: "cover",
                  transition: "all 0.25s ease",
                }}
              />
              <Typography sx={{ textAlign: "center", fontSize: "20px", mt: 1, opacity: sidebarWidth <= 100 ? 0 : 1, height: sidebarWidth <= 100 ? 0 : "auto", transition: "all 0.25s ease", whiteSpace: "nowrap" }}>
                {user?.full_name}
              </Typography>
              <Typography sx={{ textAlign: "center", opacity: sidebarWidth <= 100 ? 0 : 1, height: sidebarWidth <= 100 ? 0 : "auto", transition: "all 0.25s ease", whiteSpace: "nowrap" }}>
                {user?.role}
              </Typography>
            </Box>
          </Tooltip>

          {sidebarWidth > 100 && (
            <Typography sx={{ fontWeight: "bold", px: 1, mt: 2 }}>Resident's Information</Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <List>
            {[
              { text: "Dashboard", icon: <DashboardIcon />, page: "dashboard" },
              { text: "Residents", icon: <PeopleIcon />, page: "residents" },
              { text: "Households", icon: <HomeIcon />, page: "households" },
              { text: "Incidents", icon: <ReportIcon />, page: "incidents" },
            ].map((item) => {
              if (!user?.page_access?.includes(item.page)) return null;
              return (
                <Tooltip
                  key={item.text}
                  title={sidebarWidth <= 100 ? item.text : ""}
                  placement="right"
                  arrow
                  slotProps={{
                    tooltip: { sx: { fontSize: sidebarWidth <= 100 ? "1rem" : "0.75rem", padding: sidebarWidth <= 100 ? "10px 14px" : "6px 8px" } },
                    arrow: { sx: { "&:before": { fontSize: sidebarWidth <= 100 ? "14px" : "10px" } } },
                  }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setPage(item.page)}
                      sx={{
                        justifyContent: sidebarWidth > 100 ? "initial" : "center",
                        minHeight: 48,
                        height: sidebarWidth <= 100 ? 48 : "auto",
                        px: sidebarWidth > 100 ? 2.5 : 0,
                        borderRadius: "10px",
                        transition: "all 0.25s ease",
                        backgroundColor: item.page === page ? settings?.sidebar_button_color : "transparent",
                        color: item.page === page ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: item.page === page ? settings?.sidebar_button_color : "rgba(0, 0, 0, 0.08)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarWidth > 100 ? 3 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: sidebarWidth <= 100 ? "100%" : "auto",
                          transition: "all 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: sidebarWidth > 100 ? 1 : 0,
                          transition: "opacity 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>



          {sidebarWidth > 100 && (
            <Typography sx={{ fontWeight: "bold", px: 1, }}>Services</Typography>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Services / Admin Section */}
          <List>
            {[
              { text: "Services", icon: <VolunteerActivismIcon />, page: "services" },
              { text: "Certificates", icon: <ReceiptIcon />, page: "certificates" },
              { text: "Officials", icon: <GroupsIcon />, page: "officials" },
              { text: "Events", icon: <CalendarIcon />, page: "calendarpage" },
              { text: "Request Panel", icon: <AssignmentIcon />, page: "requestpanel" },
            ].map((item) => {
              if (!user?.page_access?.includes(item.page)) return null;
              return (
                <Tooltip
                  key={item.text}
                  title={sidebarWidth <= 100 ? item.text : ""}
                  placement="right"
                  arrow
                  slotProps={{
                    tooltip: { sx: { fontSize: sidebarWidth <= 100 ? "1rem" : "0.75rem", padding: sidebarWidth <= 100 ? "10px 14px" : "6px 8px" } },
                    arrow: { sx: { "&:before": { fontSize: sidebarWidth <= 100 ? "14px" : "10px" } } },
                  }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setPage(item.page)}
                      sx={{
                        justifyContent: sidebarWidth > 100 ? "initial" : "center",
                        minHeight: 48,
                        height: sidebarWidth <= 100 ? 48 : "auto",
                        px: sidebarWidth > 100 ? 2.5 : 0,
                        borderRadius: "10px",
                        transition: "all 0.25s ease",
                        backgroundColor: item.page === page ? settings?.sidebar_button_color : "transparent",
                        color: item.page === page ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: settings?.sidebar_button_color || "rgba(0, 0, 0, 0.08)", // ← always apply sidebarButtonColor
                          transform: "scale(1.03)",
                          color: "#fff"
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarWidth > 100 ? 3 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: sidebarWidth <= 100 ? "100%" : "auto",
                          transition: "all 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: sidebarWidth > 100 ? 1 : 0,
                          transition: "opacity 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>


          {sidebarWidth > 100 && (
            <Typography sx={{ fontWeight: "bold", px: 1, }}>Settings / Audit Logs</Typography>
          )}
          <Divider sx={{ my: 1 }} />
          {/* Audit / Profile / Admin Section */}
          <List>
            {[
              { text: "History Logs", icon: <ScheduleIcon />, page: "auditpage" },
              { text: "Barangay Profile", icon: <AccountCircleIcon />, page: "settings" },
              { text: "Settings", icon: <SettingsIcon />, page: "adminsecuritysettings" },
            ].map((item) => {
              if (!user?.page_access?.includes(item.page)) return null;
              return (
                <Tooltip
                  key={item.text}
                  title={sidebarWidth <= 100 ? item.text : ""}
                  placement="right"
                  arrow
                  slotProps={{
                    tooltip: { sx: { fontSize: sidebarWidth <= 100 ? "1rem" : "0.75rem", padding: sidebarWidth <= 100 ? "10px 14px" : "6px 8px" } },
                    arrow: { sx: { "&:before": { fontSize: sidebarWidth <= 100 ? "14px" : "10px" } } },
                  }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setPage(item.page)}
                      sx={{
                        justifyContent: sidebarWidth > 100 ? "initial" : "center",
                        minHeight: 48,
                        height: sidebarWidth <= 100 ? 48 : "auto",
                        px: sidebarWidth > 100 ? 2.5 : 0,
                        borderRadius: "10px",
                        transition: "all 0.25s ease",
                        backgroundColor: item.page === page ? settings?.sidebar_button_color : "transparent",
                        color: item.page === page ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: item.page === page ? settings?.sidebar_button_color : "rgba(0, 0, 0, 0.08)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarWidth > 100 ? 3 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: sidebarWidth <= 100 ? "100%" : "auto",
                          transition: "all 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: sidebarWidth > 100 ? 1 : 0,
                          transition: "opacity 0.25s ease",
                          color: item.page === page ? "white" : "inherit",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* Logout */}
          <List>
            <Tooltip title={sidebarWidth <= 100 ? "Logout" : ""} placement="right" arrow slotProps={{ tooltip: { sx: { fontSize: sidebarWidth <= 100 ? "1rem" : "0.75rem" } } }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    justifyContent: sidebarWidth > 100 ? "initial" : "center",
                    px: 2.5,
                    minHeight: 48,
                    borderRadius: "10px",
                    transition: "all 0.25s ease",
                    "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)", transform: "scale(1.03)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: sidebarWidth > 100 ? 3 : 0, justifyContent: "center", transition: "all 0.25s ease" }}>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ opacity: sidebarWidth > 100 ? 1 : 0, transition: "opacity 0.25s ease", color: "error.main", whiteSpace: "nowrap" }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>
        </MuiDrawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
            mt: 8,
            overflow: "auto",
          }}
        >
          <Container maxWidth={false} disableGutters>
            {renderPage()}
          </Container>
        </Box>

        {/* Footer*/}
        <Box
          component="footer"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,          // ← FIXED
            width: "100%",    // ← FULL WIDTH
            height: 40,
            bgcolor: settings?.footer_color || theme.palette.primary.main,
            color: "white",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          © {new Date().getFullYear()} Barangay Information System — All Rights Reserved
        </Box>
      </Box>
    </SettingsContext.Provider>
  );
}