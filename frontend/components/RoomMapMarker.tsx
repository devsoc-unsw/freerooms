"use client";

import { alpha } from "@mui/material";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useRoom from "hooks/useRoom";
import React, { useEffect, useRef } from "react";
import { Marker } from "react-map-gl/mapbox";

import GetDirectionsButton from "./GetDirectionsButton";

interface RoomMapMarkerProps {
  roomId: string;
  roomLocation?: (lat: number, long: number) => void;
}

const RoomMapMarker: React.FC<RoomMapMarkerProps> = ({
  roomId,
  roomLocation,
}) => {
  const { room } = useRoom(roomId);
  const hasFocusedRef = useRef(false);
  const theme = useTheme();

  useEffect(() => {
    if (!hasFocusedRef.current && room && roomLocation) {
      roomLocation(room.lat, room.long);
      hasFocusedRef.current = true;
    }
  }, [room, roomLocation]);

  if (!room) return null;
  const blue = "#1976d2";

  return (
    <Marker latitude={room.lat} longitude={room.long} anchor="top">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 500,
            textShadow:
              theme.palette.mode === "light"
                ? "-.5px -.5px 1px #f2f2f2, .5px -.5px 1px #f2f2f2, -.5px .5px 1px #f2f2f2, .5px .5px 1px #f2f2f2"
                : "",
            color: theme.palette.text.primary,
            marginBottom: 1,
            userSelect: "none",
          }}
        >
          {room.name}
        </Typography>

        <Box
          sx={(theme) => ({
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `5px solid ${blue}`,
            backgroundColor: "white",
            boxShadow: `0px 0px 6px 4px ${alpha(blue, 0.5)}`,
            position: "relative",
            "&:hover": {
              cursor: "pointer",
            },
          })}
        />
      </div>
    </Marker>
  );
};

export default RoomMapMarker;
