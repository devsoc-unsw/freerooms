"use client";

import useBookingStatus from "@frontend/hooks/bookings/useBookingStatus";
import { space } from "@frontend/theme";
import {
  formatBookingDateRange,
  formatBookingTimeRange,
} from "@frontend/utils/bookingFormatting";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { LinearProgress, Stack, Typography } from "@mui/material";
import { BookingSummary } from "common/types";

import { AppSurface } from "../ui";

type BookingTimeSummaryProps = {
  booking: Pick<BookingSummary, "start" | "end">;
};

const BookingTimeSummary = ({ booking }: BookingTimeSummaryProps) => {
  const status = useBookingStatus(booking);

  const StatusIcon =
    status?.state === "completed" ? CheckCircleOutlineIcon : AccessTimeIcon;

  return (
    <AppSurface
      sx={(theme) => ({
        padding: {
          xs: theme.space.md,
          sm: theme.space.lg,
        },
      })}
    >
      <Stack spacing={space.md}>
        <Stack spacing={space.sm}>
          <Stack
            direction="row"
            spacing={space.sm}
            sx={{ alignItems: "center" }}
          >
            <CalendarTodayOutlinedIcon
              sx={(theme) => ({
                fontSize: theme.sizes.icon.sm,
                color: theme.colours.text.secondary,
                flexShrink: 0,
              })}
            />

            <Typography variant="body1" color="text.secondary">
              {formatBookingDateRange(booking.start, booking.end)}
            </Typography>
          </Stack>

          <Typography variant="h3" component="p">
            {formatBookingTimeRange(booking.start, booking.end)}
          </Typography>
        </Stack>

        {status && (
          <Stack spacing={space.md}>
            <Stack
              direction="row"
              spacing={space.md}
              sx={{
                alignItems: "center",
                color:
                  status.state === "completed"
                    ? "text.secondary"
                    : "text.primary",
              }}
            >
              <StatusIcon
                sx={(theme) => ({
                  fontSize: theme.sizes.icon.sm,
                  flexShrink: 0,
                })}
              />

              <Typography
                variant="body1"
                sx={{
                  fontWeight: "fontWeightMedium",
                }}
              >
                {status.label}
              </Typography>
            </Stack>

            {status.progress !== null && (
              <LinearProgress
                variant="determinate"
                value={status.progress}
                aria-label="Booking progress"
                sx={(theme) => ({
                  height: theme.space.sm,
                  borderRadius: `${theme.radius.pill}px`,
                  backgroundColor: theme.colours.accent.quaternary,

                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.colours.accent.primary,
                    borderRadius: `${theme.radius.pill}px`,
                  },
                })}
              />
            )}
          </Stack>
        )}
      </Stack>
    </AppSurface>
  );
};

export default BookingTimeSummary;
