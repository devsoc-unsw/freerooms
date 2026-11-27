"use client";

import RelatedBookingRow from "@frontend/components/booking/RelatedBookingRow";
import { AppSurface } from "@frontend/components/ui/AppSurface";
import { AppButton } from "@frontend/components/ui/Controls";
import { space } from "@frontend/theme";
import getBookingHref from "@frontend/utils/getBookingHref";
import {
  excludeCurrentBooking,
  filterRelatedBookings,
  type RelatedBookingFilter,
} from "@frontend/utils/relatedBookings";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { BookingsEventResponse, BookingSummary, Room } from "common/types";
import { useEffect, useState } from "react";

type RelatedBookingsProps = {
  booking: BookingSummary;
  bookings: BookingsEventResponse[];
  rooms?: Record<string, Room>;
};

const PAGE_SIZE = 5;
const UPDATE_INTERVAL_MS = 60 * 1000;

const filters: {
  value: RelatedBookingFilter;
  label: string;
}[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "previous", label: "Previous" },
  { value: "all", label: "All" },
];

const RelatedBookings = ({
  booking,
  bookings,
  rooms,
}: RelatedBookingsProps) => {
  const [now, setNow] = useState(() => Date.now());

  const [selectedFilter, setSelectedFilter] =
    useState<RelatedBookingFilter | null>(null);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, UPDATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  const otherBookings = excludeCurrentBooking(bookings, booking);

  const hasUpcoming = otherBookings.some(
    (session) => session.end.getTime() > now,
  );

  const activeFilter =
    selectedFilter ?? (hasUpcoming ? "upcoming" : "previous");

  const filteredBookings = filterRelatedBookings(
    otherBookings,
    activeFilter,
    now,
  );

  const visibleBookings = filteredBookings.slice(0, visibleCount);

  const remainingCount = filteredBookings.length - visibleBookings.length;

  const selectFilter = (filter: RelatedBookingFilter) => {
    setSelectedFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  if (otherBookings.length === 0) {
    return null;
  }

  return (
    <AppSurface
      sx={(theme) => ({
        padding: theme.space.md,
      })}
    >
      <Stack spacing={space.md}>
        <Stack
          direction="row"
          spacing={space.sm}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="cardTitle" component="h2">
            Related sessions
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {otherBookings.length}{" "}
            {otherBookings.length === 1 ? "session" : "sessions"}
          </Typography>
        </Stack>

        <Box
          role="group"
          aria-label="Filter related sessions"
          sx={(theme) => ({
            display: "flex",
            flexWrap: "wrap",
            gap: theme.space.sm,
          })}
        >
          {filters.map(({ value, label }) => (
            <AppButton
              key={value}
              size="small"
              selected={activeFilter === value}
              aria-pressed={activeFilter === value}
              onClick={() => selectFilter(value)}
            >
              {label}
            </AppButton>
          ))}
        </Box>

        {visibleBookings.length === 0 ? (
          <Typography color="text.secondary">
            {activeFilter === "upcoming"
              ? "No upcoming sessions"
              : "No previous sessions"}
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {visibleBookings.map((session) => (
              <RelatedBookingRow
                key={getBookingHref(session.roomId, session.occurrenceId)}
                booking={session}
                roomName={rooms?.[session.roomId]?.name}
                showName={session.name !== booking.name}
              />
            ))}
          </Stack>
        )}

        {remainingCount > 0 && (
          <AppButton
            variant="text"
            fullWidth
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Show more ({remainingCount} remaining)
          </AppButton>
        )}
      </Stack>
    </AppSurface>
  );
};

export default RelatedBookings;
