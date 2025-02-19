import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ModalComponent from "@/components/IframeModal";
import Image from "next/image";
import Link from "next/link";
import companyLogo from "@/assets/aims-logo.png";



const Homepage = () => {
  const [open, setOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [logos, setLogos] = useState({ analytical: [], process: [] });

  // ✅ Detect Mobile Screens
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch("/api/logos");
        const data = await response.json();

        if (data.success) {
          const analytical = data.data.filter(
            (logo) => logo.name === "analytical"
          );
          const process = data.data.filter((logo) => logo.name === "process");

          setLogos({ analytical, process });
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);

  const handleOpen = (link) => {
    setIframeSrc(link);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container
      sx={{
        paddingY: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: "linear-gradient(62deg, #8EC5FC, #E0C3FC)";
        
      }}
    >
      
      {/* Login Button - Top Right */}
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
        href="/login"
      >
        <LoginIcon />
      </IconButton>

      {/* Clickable Company Logo */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Link href="https://aimsgt.com/" passHref target="_blank">
          <Image
            src={companyLogo}
            alt="Company Logo"
            width={150}
            height={150}
            style={{ cursor: "pointer", transition: "0.3s" }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
        </Link>
      </Box>

      {/* Table with Logos */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflowX: "auto",
          width: "100%",
          maxWidth: isMobile ? "100%" : 800,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Table sx={{ bgcolor: "rgba(255, 255, 255, 0.4)" }}>
          <TableHead sx={{ bgcolor: "rgba(33, 150, 243, 0.8)" }}>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "18px", color: "white" }}
              >
                Analytical
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "18px", color: "white" }}
              >
                Process
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logos.analytical.length > 0 || logos.process.length > 0 ? (
              [
                ...Array(
                  Math.max(logos.analytical.length, logos.process.length)
                ),
              ].map((_, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { bgcolor: "rgba(225,225,225,0.2)" },
                  }}
                >
                  <TableCell align="center">
                    {logos.analytical[index] ? (
                      <img
                        src={logos.analytical[index].imageUrl}
                        width={isMobile ? "100" : "200"}
                        alt="Analytical Logo"
                        style={{
                          cursor: "pointer",
                          transition: "0.3s",
                          borderRadius: "8px",
                          maxWidth: "100%",
                        }}
                        onClick={() => handleOpen(logos.analytical[index].url)}
                        onMouseOver={(e) =>
                          !isMobile &&
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          !isMobile && (e.target.style.transform = "scale(1)")
                        }
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {logos.process[index] ? (
                      <img
                        src={logos.process[index].imageUrl}
                        width={isMobile ? "100" : "200"}
                        alt="Process Logo"
                        style={{
                          cursor: "pointer",
                          transition: "0.3s",
                          borderRadius: "8px",
                          maxWidth: "100%",
                        }}
                        onClick={() => handleOpen(logos.process[index].url)}
                        onMouseOver={(e) =>
                          !isMobile &&
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          !isMobile && (e.target.style.transform = "scale(1)")
                        }
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{ py: 3, fontWeight: "bold", fontSize: "16px" }}
                >
                  No logos available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Iframe */}
      <ModalComponent
        open={open}
        handleClose={handleClose}
        iframeSrc={iframeSrc}
      />
    </Container>
  );
};

export default Homepage;
