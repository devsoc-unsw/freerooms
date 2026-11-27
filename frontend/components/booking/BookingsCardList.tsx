"use client";

import BookingsCard from "@frontend/components/booking/BookingsCard";
import { Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { PaginatedBooking } from "common/types";
import { useEffect, useState } from "react";

type BookingsCardListProps = {
  bookings?: PaginatedBooking[];
  emptyMessage?: string;
};

const EmptyState = styled(Typography)(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  color: theme.colours.text.secondary,
  padding: `${theme.space.xxl}px 0`,
}));

const CardGrid = styled("div")(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.space.lg,
  alignItems: "start",
  [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, 1fr)" },
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, 1fr)" },
}));

const BookingsCardList: React.FC<BookingsCardListProps> = ({
  bookings,
  emptyMessage = "No bookings to show.",
}: BookingsCardListProps) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();

    const intervalId = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (!bookings) {
    return (
      <CardGrid>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rounded"
            width="100%"
            sx={{ height: "13rem" }}
          />
        ))}
      </CardGrid>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <CardGrid>
      {bookings.map((booking) => (
        <BookingsCard
          key={`${booking.roomId}-${booking.occurrenceId}`}
          booking={booking}
          now={now}
        />
      ))}
    </CardGrid>
  );
};

export default BookingsCardList;
