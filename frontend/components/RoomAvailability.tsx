import { styled, Typography, TypographyProps } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

const RoomBoxHeading = styled(Typography)<TypographyProps>(() => ({
  //fontSize: 16,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
}));

const RoomBoxSubheading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
}));

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

type RoomAvailabilityProps = Pick<RoomAvailabilityBoxProps, "roomStatus">;

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ roomStatus }) => {
  const date = new Date(roomStatus.endtime);
  const hoursMinutes = date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const untilMessage = {
    free: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
    busy: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
    soon: "at " + hoursMinutes,
  };
  return (
    <Stack direction="row" alignItems="center" spacing={0.4}>
      <RoomBoxHeading sx={{ color: roomStatusColor[roomStatus.status] }}>
        {roomStatusMessage[roomStatus.status]}
      </RoomBoxHeading>
      <RoomBoxSubheading sx={{ color: roomStatusColor[roomStatus.status] }}>
        {untilMessage[roomStatus.status]}
      </RoomBoxSubheading>
    </Stack>
  );
};

export default RoomAvailability;
