import { RoomAvailabilityBoxProps } from "@frontend/views/RoomAvailabilityBox";
import { styled, Typography, TypographyProps, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

const RoomBoxHeading = styled(Typography)<TypographyProps>(() => ({
  fontSize: 16,
  fontWeight: 500,
  whiteSpace: "nowrap",
}));

const RoomBoxSubheading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
}));

const roomStatusMessage = {
  free: "Available",
  busy: "Unavailable",
  soon: "Available Soon",
};

type RoomAvailabilityProps = Pick<RoomAvailabilityBoxProps, "roomStatus">;

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ roomStatus }) => {
  const theme = useTheme();

  const roomStatusColor = {
    free: theme.colours.status.available.text,
    busy: theme.colours.status.unavailable.text,
    soon: theme.colours.status.soon.text,
  };

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
    <Stack
      direction="column"
      sx={{
        alignItems: "flex-end",
      }}
    >
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
