import { RoomAvailabilityBoxProps } from "@frontend/components/rooms/RoomAvailabilityBox";
import { getCardStatus, getStatusEnd } from "@frontend/utils/roomStatus";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { styled, Typography, TypographyProps, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import React from "react";

const RoomBoxHeading = styled(Typography)<TypographyProps>(() => ({
  fontSize: 16,
  fontWeight: 500,
  whiteSpace: "nowrap",
}));

const RoomBoxSubheading = styled(Typography)<TypographyProps>(() => ({
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
  reason?: string; // used only for 'pill'. What booking is using the room at the end time
  until?: Date;
};

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({
  roomStatus,
  variant = "stacked",
  reason,
  until,
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
    const cardStatus = getCardStatus(roomStatus);
    const colours = theme.colours.status[statusColourKey[cardStatus]];
    const end =
      getStatusEnd(roomStatus) ??
      (cardStatus === "free" ? (until ?? null) : null);
    const time = end ? format(end, "h:mmaaa") : null;
    const text = [
      roomStatusMessage[cardStatus],
      time && `until ${time}`,
      reason && `- ${reason}`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <StatusPill
        sx={{
          color: colours.text,
          backgroundColor: colours.background,
          borderColor: colours.text,
        }}
      >
        <AccessTimeOutlinedIcon />
        <Typography
          variant="body2"
          noWrap
          title={text}
          sx={{ minWidth: 0, fontWeight: theme.typography.fontWeightMedium }}
        >
          {text}
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
