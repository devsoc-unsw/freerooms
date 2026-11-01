import { RoomAvailabilityBoxProps } from "@frontend/views/RoomAvailabilityBox";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { alpha, styled, Typography, TypographyProps, useTheme } from "@mui/material";
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

const StatusPill = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  width: "fit-content",
  maxWidth: "100%",
  gap: theme.space.xs,
  padding: `0 ${theme.space.sm}px`,
  border: "1.5px solid",
  borderRadius: theme.radius.pill,
  fontSize: theme.typography.body2.fontSize,
  "& svg": { fontSize: "inherit" },
}));

const roomStatusMessage = {
  free: "Available",
  busy: "Unavailable",
  soon: "Available Soon",
};

const statusColourKey = {
  free: "available",
  busy: "unavailable",
  soon: "soon",
} as const;

type RoomAvailabilityProps = Pick<RoomAvailabilityBoxProps, "roomStatus"> & {
  // stacked is two right-aligned lines for use in lists, pill is one line inside a coloured pill (for room cards)
  variant?: "stacked" | "pill";
};

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({
  roomStatus,
  variant = "stacked",
}) => {
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

  if (variant === "pill") {
    const colour = theme.colours.status[statusColourKey[roomStatus.status]].text;
    return (
      <StatusPill
        sx={{
          color: colour,
          backgroundColor: alpha(colour, 0.2),
          borderColor: colour,
        }}
      >
        <AccessTimeOutlinedIcon />
        <Typography
          variant="body2"
          sx={{ fontWeight: theme.typography.fontWeightMedium, whiteSpace: "nowrap" }}
        >
          {`${roomStatusMessage[roomStatus.status]} ${untilMessage[roomStatus.status]}`.trim()}
        </Typography>
      </StatusPill>
    );
  }

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
