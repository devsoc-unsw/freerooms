import { space } from "@frontend/theme";
import {
  formatBookingDateRange,
  formatBookingTimeRange,
} from "@frontend/utils/bookingFormatting";
import getBookingHref from "@frontend/utils/getBookingHref";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Stack, Typography } from "@mui/material";
import type { BookingsEventResponse } from "common/types";
import Link from "next/link";

type RelatedBookingRowProps = {
  booking: BookingsEventResponse;
  roomName?: string;
  showName?: boolean;
};

const RelatedBookingRow = ({
  booking,
  roomName,
  showName = false,
}: RelatedBookingRowProps) => (
  <Box
    component={Link}
    href={getBookingHref(booking.roomId, booking.occurrenceId)}
    sx={(theme) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.md,
      padding: theme.space.md,
      borderRadius: `${theme.radius.lg}px`,
      color: theme.colours.text.primary,
      textDecoration: "none",
      transition: theme.transitions.create("background-color"),

      "&:hover": {
        backgroundColor: theme.colours.accent.quaternary,
      },

      "&:focus-visible": {
        outline: `2px solid ${theme.colours.accent.primary}`,
      },
    })}
  >
    <Stack spacing={space.xs} sx={{ minWidth: 0 }}>
      {showName && (
        <Typography variant="subtitle1" sx={{ overflowWrap: "anywhere" }}>
          {booking.name}
        </Typography>
      )}

      <Typography variant="subtitle1">
        {formatBookingDateRange(booking.start, booking.end)}
      </Typography>

      <Typography variant="body1">
        {formatBookingTimeRange(booking.start, booking.end)}
      </Typography>

      <Stack
        direction="row"
        spacing={space.xs}
        sx={{
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        <LocationOnOutlinedIcon
          sx={(theme) => ({
            fontSize: theme.sizes.icon.sm,
            flexShrink: 0,
          })}
        />

        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
          {roomName ?? booking.roomId}
        </Typography>
      </Stack>
    </Stack>

    <ChevronRightIcon
      sx={{
        color: "text.secondary",
        flexShrink: 0,
      }}
    />
  </Box>
);

export default RelatedBookingRow;
