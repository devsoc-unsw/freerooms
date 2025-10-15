"use client";

import { Room } from "@common/types";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMapboxNavigation from "hooks/useMapboxNavigation";
import React, { useState } from "react";

import GetDirectionsButton from "./GetDirectionsButton";

type GetDirectionsBoxProps = {
  userLat: number | undefined;
  userLng: number | undefined;
  setRouteGeoJSON: (geojson: any) => void;
  geometry?: any;
  room: Room;
};

const GetDirectionsBox: React.FC<GetDirectionsBoxProps> = ({
  userLat,
  userLng,
  setRouteGeoJSON,
  geometry,
  room,
}) => {
  const [open, setOpen] = useState(true);
  const { distance_km, duration_mins } = useMapboxNavigation(
    userLat,
    userLng,
    room
  );

  if (!open || !room.name) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#FFFBF9",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        pt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 999,
        minWidth: 260,
        width: 360,
        minHeight: 158,
        height: "auto",
        border: "1px solid #F3D0C5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "14px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e76b04"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-map-pin-icon lucide-map-pin"
            style={{ marginLeft: "5px", marginTop: "-1px" }}
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              fontSize: 18,
              lineHeight: 1,
              color: "black",
            }}
          >
            {room.name || "Room"}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setOpen(false)}
          sx={{
            color: "#707070",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          pl: "2px",
          width: "100%",
          mb: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 10,
            backgroundColor: "#fde7e1",
            color: "rgba(212, 97, 60, 1)",
            width: "auto",
            height: 32,
            px: "12px",
            py: "6px",
            marginLeft: "2px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e76b04"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-clock-icon lucide-clock"
          >
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <Typography sx={{ fontSize: "13px", pl: "4px" }}>
            {duration_mins !== undefined
              ? `${duration_mins.toFixed(3)} mins`
              : "-"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 10,
            backgroundColor: "#fde7e1",
            color: "#D4613C",
            width: "auto",
            height: 32,
            px: "12px",
            py: "6px",
            ml: "8px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e76b04"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-footprints-icon lucide-footprints"
          >
            <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
            <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
            <path d="M16 17h4" />
            <path d="M4 13h4" />
          </svg>
          <Typography sx={{ fontSize: "13px", pl: "4px" }}>
            {distance_km !== undefined
              ? `${Number(distance_km.toFixed(3))} km`
              : "-"}
          </Typography>
        </Box>
      </Box>

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
