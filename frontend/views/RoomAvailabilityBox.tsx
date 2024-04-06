import { RoomStatus } from "@common/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

import useRoom from "../hooks/useRoom";

interface RoomAvailabilityBoxProps {
  roomNumber: string;
  roomStatus: RoomStatus;
  buildingId: string;
}

const RoomAvailabilityBox: React.FC<RoomAvailabilityBoxProps> = ({
  roomNumber,
  roomStatus,
  buildingId,
}) => {
  const date = new Date(roomStatus.endtime);
  const hoursMinutes = date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const roomStatusColor = {
    free: "#2AA300",
    busy: "#D30000",
    soon: "#ffa600",
  };

  const roomStatusMessage = {
    free: "Available",
    busy: "Unavailable",
    soon: "Available Soon",
  };

  const untilMessage = {
    free: hoursMinutes === "Invalid Date" ? "" : `until ${hoursMinutes}`,
    busy: hoursMinutes === "Invalid Date" ? "" : `until ${hoursMinutes}`,
    soon: `at ${hoursMinutes}`,
  };

  const { room } = useRoom(`${buildingId}-${roomNumber}`);

  return (
    <Link href={`/room/${buildingId}-${roomNumber}`}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 10,
          height: 70,
          fontSize: 20,
          fontWeight: 500,
          backgroundColor: "#FFFFFF",
          color: "black",
          padding: "16px 24px",
          margin: "12px 8px",
          cursor: "pointer",
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: "#1976d2",
          },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {roomNumber}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
            {!room ? "" : room.name}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginRight: 1,
            }}
          >
            <Typography
              sx={{
                color: roomStatusColor[roomStatus.status],
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {roomStatusMessage[roomStatus.status]}
            </Typography>
            <Typography
              sx={{
                color: roomStatusColor[roomStatus.status],
                fontSize: 12,
                fontWeight: 400,
              }}
            >
              {untilMessage[roomStatus.status]}
            </Typography>
          </Box>
          <ChevronRightIcon style={{ color: "grey" }} />
        </Box>
      </Box>
    </Link>
  );
};

export default RoomAvailabilityBox;
