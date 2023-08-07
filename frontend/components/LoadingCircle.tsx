import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const LoadingCircle = () => (
  <Box sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "block"
  }}>
    <CircularProgress color="primary" size={150} />
  </Box>
)

export default LoadingCircle;