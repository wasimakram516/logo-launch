import React, { useState, useEffect } from "react";
import { Modal, Box, useMediaQuery, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { HorizontalRule } from "@mui/icons-material";

const ModalComponent = ({ open, handleClose, iframeSrc }) => {
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [key, setKey] = useState(0); // ✅ Forces re-render
  const isTouchDevice = useMediaQuery("(max-width: 1024px)"); // ✅ Detects mobile screens

  const notWorking= ["http://abc@gmail.com", "","",""];
  
  useEffect(() => {
    setKey((prev) => prev + 1); // ✅ Re-renders when full-screen is toggled
  }, [isFullScreen]);

  // ✅ Toggle Full-Screen Mode
  const toggleFullScreen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFullScreen((prev) => !prev);
  };

  // ✅ Close Modal
  const closeModal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        key={key} // ✅ Fixes touch issues
        sx={{
          position: "relative",
          width: isTouchDevice ? "90vw" : isFullScreen ? "100vw" : "80%",
          height: isTouchDevice ? "95vh" : isFullScreen ? "100vh" : "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          overflow: "hidden",
          borderRadius: isFullScreen || isTouchDevice ? "0px" : "8px",
        }}
      >
        {/* ✅ Buttons only show on desktop */}
        {!isTouchDevice && (
          <Box
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              display: "flex",
              gap: 1,
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={toggleFullScreen}
              disableRipple
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
              }}
            >
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>

            <IconButton
              onClick={closeModal}
              disableRipple
              sx={{
                bgcolor: "rgba(255, 0, 0, 0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255, 0, 0, 0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* ✅ Iframe auto-fills but leaves a tap-to-close area on mobile */}
        <iframe
          key={key}
          src={iframeSrc}
          title="Embedded Content"
          width="100%"
          height="100%"
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          style={{
            pointerEvents: "auto",
            touchAction: "none",
          }}
        />
      </Box>
    </Modal>
  );
};

export default ModalComponent;
