import React, { useEffect, useState, useMemo, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { SettingsContext } from "../App";
import BagongPilipinas from "../assets/BagongPilipinas.png";
import Barangay369 from "../assets/Barangay369.jpg";
import LungsodngManila from "../assets/LungsodngManila.jpg";
import api from "../api";
import API_BASE_URL from "../ApiConfig";
import { QRCodeCanvas } from "qrcode.react";


const API_ROOT = `${API_BASE_URL}`; // <-- same as your OfficialsPage.jsx

const ResidentIDCard = ({ resident }) => {
    const { settings } = useContext(SettingsContext);

    if (!resident) return null;
    const qrValue = `${window.location.origin}/?public=residentview&code=${resident.resident_code}`;


    const [officials, setOfficials] = useState([]);
    const [captainName, setCaptainName] = useState("");
    const [secretaryName, setSecretaryName] = useState("");

    /** LOAD OFFICIALS ONCE */
    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                const res = await api.get("/officials");
                setOfficials(res.data || []);
            } catch (e) {
                console.error("Failed to load officials", e);
            }
        };
        fetchOfficials();
    }, []);

    /** AUTO-SET CAPTAIN + SECRETARY */
    useEffect(() => {
        if (!officials.length) return;

        const captain =
            officials.find((o) => o.is_captain || o.position === "Punong Barangay") || null;

        const secretary =
            officials.find((o) => o.is_secretary || o.position === "Barangay Secretary") || null;

        if (captain) setCaptainName(captain.full_name);
        if (secretary) setSecretaryName(secretary.full_name);
    }, [officials]);

    /** CAPTAIN PROFILE IMAGE */
    const captainOfficial = useMemo(
        () =>
            officials.find((o) => o.is_captain || o.position === "Punong Barangay") || null,
        [officials]
    );

    const captainProfileUrl = captainOfficial?.profile_img
        ? captainOfficial.profile_img.startsWith("http")
            ? captainOfficial.profile_img
            : `${API_ROOT}${captainOfficial.profile_img.startsWith("/") ? "" : "/"}${captainOfficial.profile_img}`
        : null;


    const formatDateLong = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTodayPH = () => {
        return new Date().toLocaleDateString("en-US", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };



    return (
        <Box>

            {/* ========================== */}
            {/*        FRONT SIDE          */}
            {/* ========================== */}
            <Box
                id="resident-id-print"

                sx={{
                    "@media print": {
                        marginLeft: "20mm", // 👈 adjust as needed
                        marginTop: "5mm",
                    },
                    width: 350,
                    height: 225,
                    borderRadius: "6px",
                    border: "1px solid #000",
                    bgcolor: "white",
                    overflow: "hidden",
                    fontFamily: "Arial",
                    p: 1,
                    background: "linear-gradient(to left, #e6f5e6, #7bcf7b)",
                    mb: 3,
                    position: "relative",
                }}
            >

                {/* TOP LOGOS — EXACT LIKE SAMPLE */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                        mt: 0.5,
                    }}
                >
                    <img src={Barangay369} width={50} style={{ borderRadius: "50%" }} />
                    <img
                        src={LungsodngManila}
                        width={50}

                        style={{ borderRadius: "50%" }}
                        alt="Lungsod ng Manila"
                    />
                </Box>

                {/* HEADER TEXT */}
                <Box sx={{ textAlign: "center", mt: -7 }}>
                    <Typography sx={{ fontSize: "10px", fontWeight: "bold" }}>
                        Republic of the Philippines
                    </Typography>

                    <Typography sx={{ fontSize: "10px" }}>City of Manila</Typography>

                    <Typography sx={{ fontSize: "10px", fontWeight: "bold" }}>
                        {settings.address &&
                            settings.address.split(/,\s*(?=DISTRICT)/i).map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i === 0 && <br />}
                                </React.Fragment>
                            ))}
                    </Typography>

                </Box>

                {/* GREEN BAR */}
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#0a7300",
                        border: "1px solid white",
                        borderRadius: "5px",
                        mt: .5,
                        py: 0.2,

                    }}
                >
                    <Typography
                        sx={{
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textAlign: "center",
                            letterSpacing: "0.4px",
                        }}
                    >
                        BARANGAY RESIDENT IDENTIFICATION CARD
                    </Typography>
                </Box>

                {/* BODY CONTENT */}
                <Box sx={{ display: "flex", mt: 1 }}>

                    {/* PHOTO */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                marginLeft: "0.5rem",
                                border: "1px solid black",
                                borderRadius: "4px",
                                overflow: "hidden",
                                bgcolor: "#d9d9d9",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            {resident.profile_picture ? (
                                <img
                                    src={
                                        resident.profile_picture.startsWith("http")
                                            ? resident.profile_picture
                                            : `${API_ROOT}${resident.profile_picture.startsWith("/") ? "" : "/"}${resident.profile_picture}`
                                    }
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Typography variant="caption" sx={{ fontSize: "6px" }}>
                                    No Photo
                                </Typography>
                            )}
                        </Box>


                        {/* SIGNATURE */}
                        <Box sx={{ scale: "0.8", ml: "0.5rem" }}>
                            <Typography sx={{ fontSize: "8px", textAlign: "center" }}>
                                ______________________
                            </Typography>
                            <Typography sx={{ fontSize: "6px", textAlign: "center" }}>
                                SIGNATURE
                            </Typography>
                        </Box>
                    </Box>

                    {/* DETAILS RIGHT SIDE */}
                    <Box sx={{ scale: "0.8", marginTop: "-0.7rem", maxWidth: 260, minWidth: 260, marginLeft: "-1rem" }}>
                        <Typography sx={{ fontSize: "12px" }}>
                            <b>SURNAME:</b> {resident.last_name.toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>GIVEN NAME:</b> {resident.first_name.toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>MIDDLE NAME:</b> {resident.middle_name?.toUpperCase() || ""}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", maxWidth: 260, marginTop: "-3px" }}>
                            <b>ADDRESS:</b> {resident.address.toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>DATE OF BIRTH:</b> {formatDateLong(resident.birthdate)}
                        </Typography>

                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>PRECINCT NO:</b> {resident.precint_no}
                        </Typography>


                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>DATE ISSUED:</b> {formatTodayPH()}
                        </Typography>





                        <Typography sx={{ fontSize: "12px", marginTop: "-3px" }}>
                            <b>VALID UNTIL:</b> END OF TERM
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            mb: -1.5
                        }}
                    >
                        <QRCodeCanvas
                            value={qrValue}
                            size={60}
                            sx={{ height: "50px" }}
                            level="H"
                        />

                    </Box>
                </Box>
            </Box>

            {/* ========================== */}
            {/*        BACK SIDE           */}
            {/* ========================== */}
            <Box
                id="resident-id-print"

                sx={{
                    "@media print": {
                        marginLeft: "20mm", // 👈 adjust as needed
                    },
                    width: 350,
                    height: 225,
                    borderRadius: "10px",
                    border: "1px solid #000",
                    overflow: "hidden",
                    fontFamily: "Arial",
                    position: "relative",
                    background: "linear-gradient(to right, #e6f5e6, #7bcf7b)",
                }}
            >
                {/* TOP TITLE */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 6,
                        left: 8,
                        right: 8,
                        backgroundColor: "#2e7d32",
                        borderRadius: "4px",
                        border: "1px solid white",
                        py: 0.2,
                    }}
                >
                    <Typography
                        sx={{
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                            textAlign: "center",

                        }}
                    >
                        BARANGAY RESIDENT IDENTIFICATION CARD
                    </Typography>
                </Box>

                {/* MAIN CONTENT */}
                {/* MAIN CONTENT */}
                <Box sx={{ display: "flex", height: "100%", pt: 4 }}>
                    {/* LEFT PHOTO */}
                    <Box
                        sx={{
                            width: 120,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        <Box sx={{ textAlign: "center" }}>
                            {/* IMAGE WITH DOUBLE BORDER */}
                            <Box
                                sx={{
                                    border: "3px solid black",  // Outer thick border
                                    p: "2px",                  // Padding between outer and inner
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 95,
                                        height: 145,
                                        border: "3px solid black",  // Inner border
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
                                            alt="Captain"
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

                            {/* NAME UNDER IMAGE */}
                            <Typography sx={{ fontSize: "8px", fontWeight: "bold", mt: 0.5 }}>
                                {captainName || "P/B MANUEL R. CALLANTA"}
                            </Typography>
                            <Typography sx={{ fontSize: "8px" }}>
                                CHAIRMAN
                            </Typography>
                        </Box>
                    </Box>


                    {/* RIGHT SIDE */}
                    <Box sx={{ flex: 1, px: 1 }}>
                        {/* CENTER LOGO */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: -.2,
                                mb: 0.5,
                            }}
                        >

                        </Box>

                        {/* DESCRIPTION */}
                        <Typography
                            sx={{
                                fontSize: "9.5px",
                                lineHeight: 1.25,
                                textAlign: "justify",
                            }}
                        >
                            This Barangay Identification Card (ID) hereby certifies that the bearer
                            is a recognised resident of this Barangay. This ID is non-transferable
                            and is to be used by the named individual for identification purposes
                            within the community and for accessing local services and benefits.
                            Please ensure that this ID is always carried with you within the
                            barangay premises. Any misuse or fraudulent use will result in legal
                            action and revocation of the ID.
                        </Typography>

                        {/* SIGNATURE + NAME */}

                    </Box>
                </Box>

                {/* EMERGENCY CONTACT + LOGO WRAPPER */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 14,
                        right: 6,
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 0.5,


                    }}
                >
                    {/* EMERGENCY CONTACT (BOX ONLY) */}
                    <Box
                        sx={{
                            bgcolor: "#e0e0e0",
                            border: "1px solid black",
                            borderRadius: "3px",
                            px: 0.6,
                            py: 0.4,
                            width: 150,

                        }}
                    >
                        <Typography sx={{ fontSize: "7px", fontWeight: "bold" }}>
                            CONTACT IN CASE OF EMERGENCY
                        </Typography>
                        <Typography sx={{ fontSize: "7px" }}>
                            NAME: {resident.fullname_emergency
                                ? resident.fullname_emergency.toUpperCase()
                                : ""}
                        </Typography>
                        <Typography sx={{ fontSize: "7px" }}>
                            PHONE: {resident.contact_no_emergency || ""}
                        </Typography>
                    </Box>

                    {/* LOGO (OUTSIDE THE BOX) */}
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={Barangay369}
                            alt="Barangay Logo"
                            width={50}
                            height={50}
                            style={{ borderRadius: "50%" }}
                        />
                    </Box>
                </Box>



            </Box >

        </Box >
    );
};

export default ResidentIDCard;