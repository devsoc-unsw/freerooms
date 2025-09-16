"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import GetDirectionsButton from "./GetDirectionsButton";
import Typography from "@mui/material/Typography";

type GetDirectionsBoxProps = {
  userLat: number | undefined;
  userLng: number | undefined;
  setRouteGeoJSON: (geojson: any) => void;
  geometry?: any;
  roomName: string;
};

const GetDirectionsBox: React.FC<GetDirectionsBoxProps> = ({
  userLat,
  userLng,
  setRouteGeoJSON,
  geometry,
  roomName,
}) => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 999,
        minWidth: 260,
      }}
    >
      {/* Header row with room name + close button */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {roomName || "Room"}
        </Typography>
        <IconButton size="small" onClick={() => setOpen(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Button centered at the bottom */}
      <GetDirectionsButton
        userLat={userLat}
        userLng={userLng}
        setRouteGeoJSON={setRouteGeoJSON}
        geometry={geometry}
      />
    </Box>
  );
};

export default GetDirectionsBox;
