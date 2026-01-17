import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import api from "../api";
import API_BASE_URL from "../ApiConfig";

const API_ROOT = `${API_BASE_URL}`;

export default function AboutUs() {
  const [officials, setOfficials] = useState([]);

  useEffect(() => {
    const loadOfficials = async () => {
      const res = await api.get("/officials");
      setOfficials(res.data || []);
    };
    loadOfficials();
  }, []);

  const byPos = (p) => officials.filter((o) => o.position === p);

  const chairman = byPos("Punong Barangay")[0];
  const kagawads = byPos("Barangay Kagawad");
  const secretary = byPos("Barangay Secretary")[0];
  const treasurer = byPos("Barangay Treasurer")[0];

  const cardWrap = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 210, // 🔒 LOCK TOTAL HEIGHT
  };

  const plateBase = {
    mt: 1,
    width: 150,
    height: 55, // 🔒 LOCK PLATE HEIGHT
    bgcolor: "#c8a46a",
    border: "2px solid black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const nameClamp = {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    lineHeight: 1.1,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    maxWidth: 135,
  };

  // // 🔒 Disable right-click
  // document.addEventListener('contextmenu', (e) => e.preventDefault());

  // // 🔒 Block DevTools shortcuts + Ctrl+P silently
  // document.addEventListener('keydown', (e) => {
  //   const isBlockedKey =
  //     e.key === 'F12' || // DevTools
  //     e.key === 'F11' || // Fullscreen
  //     (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
  //     (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
  //     (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

  //   if (isBlockedKey) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // });



  return (
    <Box
      sx={{
        minHeight: "30vh",
        backgroundImage: "url('/about-bg.png')", // 👈 your LIGHT background
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: 4,
        py: 12,
        height: "calc(110vh - 270px)",
        overflowY: "auto"
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h2"
        align="center"
        fontWeight="bold"
        sx={{ mb: 4, color: "black" }}
      >
        ABOUT US
      </Typography>

      {/* MAIN CONTAINER */}
      <Box sx={{ position: "relative" }}>
        {/* CENTER LINE */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "3px",
            bgcolor: "black",
            transform: "translateX(-50%)",
          }}
        />

        <Grid container spacing={6}>
          {/* LEFT SIDE */}
          <Grid sx={{ ml: 25, mt: 10 }} item xs={12} md={6}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 2, textAlign: "center", color: "black", letterSpacing: 2, }}
            >
              VISION
            </Typography>

            <Typography
              sx={{
                mb: 6,
                maxWidth: 600,
                textAlign: "justify",
                fontSize: "24px",
                letterSpacing: 1,
                fontWeight: 600,
                color: "black",
              }}
            >
              To envision a vibrant Barangay 369, an economic hub of God-fearing
              people who enjoy quality of life, thrived in a peaceful sustainable
              environment propelled by proactive governance with highly
              capacitated human resource upholding dignity and integrity.
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 2, textAlign: "center", color: "black", letterSpacing: 2, }}
            >
              MISSION
            </Typography>

            <Typography
              sx={{
                maxWidth: 600,
                textAlign: "justify",
                fontSize: "24px",
                letterSpacing: 1,
                fontWeight: 600,
                color: "black",

              }}
            >
              To create a safe and supportive environment where everyone is
              treated fairly, respected, and valued. Through effective
              governance and collaboration, we aspire to build a progressive
              and prosperous barangay that is admired and emulated by others.
            </Typography>
          </Grid>


          {/* RIGHT SIDE */}
          <Grid sx={{ marginLeft: 35, mt: 7 }} item xs={12} md={6}>

            {/* CHAIRMAN */}
            {chairman && (
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Box sx={{ ...cardWrap, height: 240 }}>
                  <Avatar
                    src={chairman.profile_img && `${API_ROOT}${chairman.profile_img}`}
                    sx={{
                      width: 140,
                      height: 140,
                      border: "3px solid black",
                    }}
                  />

                  <Box sx={{ ...plateBase, width: 180 }}>
                    <Typography sx={nameClamp}>
                      {chairman.full_name}
                    </Typography>
                    <Typography fontSize={11} color="black">
                      Chairman
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* KAGAWADS */}
            <Box sx={{ mb: 5 }}>
              {/* TOP ROW */}
              <Grid container spacing={3} justifyContent="center">
                {kagawads.slice(0, 4).map((k) => (
                  <Grid item xs={3} key={k.id}>
                    <Box sx={cardWrap}>
                      <Avatar
                        src={k.profile_img && `${API_ROOT}${k.profile_img}`}
                        sx={{
                          width: 110,
                          height: 110,
                          border: "2px solid black",
                        }}
                      />

                      <Box sx={plateBase}>
                        <Typography sx={nameClamp}>
                          {k.full_name}
                        </Typography>
                        <Typography fontSize={10} color="black">
                          Kagawad
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* BOTTOM ROW */}
              <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
                {kagawads.slice(4, 8).map((k) => (
                  <Grid item xs={3} key={k.id}>
                    <Box sx={cardWrap}>
                      <Avatar
                        src={k.profile_img && `${API_ROOT}${k.profile_img}`}
                        sx={{
                          width: 110,
                          height: 110,
                          border: "2px solid black",
                        }}
                      />

                      <Box sx={plateBase}>
                        <Typography sx={nameClamp}>
                          {k.full_name}
                        </Typography>
                        <Typography fontSize={10} color="black">
                          Kagawad
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* SECRETARY + TREASURER */}
            <Grid container spacing={4} justifyContent="center">
              {[secretary, treasurer].map(
                (p, i) =>
                  p && (
                    <Grid item xs={6} key={i}>
                      <Box sx={{ ...cardWrap, height: 220 }}>
                        <Avatar
                          src={p.profile_img && `${API_ROOT}${p.profile_img}`}
                          sx={{
                            width: 120,
                            height: 120,
                            border: "2px solid black",
                          }}
                        />

                        <Box sx={plateBase}>
                          <Typography sx={nameClamp}>
                            {p.full_name}
                          </Typography>
                          <Typography fontSize={10} color="black">
                            {i === 0 ? "Secretary" : "Treasurer"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )
              )}
            </Grid>
          </Grid>


        </Grid>
      </Box>
    </Box>
  );
}
