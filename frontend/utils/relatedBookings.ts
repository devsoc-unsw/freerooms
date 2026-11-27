import type { BookingsEventResponse, BookingSummary } from "common/types";

export type RelatedBookingFilter = "upcoming" | "previous" | "all";

type BookingIdentity = Pick<BookingSummary, "roomId" | "occurrenceId">;

export const excludeCurrentBooking = (
  bookings: BookingsEventResponse[],
  currentBooking: BookingIdentity
): BookingsEventResponse[] =>
  bookings.filter(
    (booking) =>
      booking.roomId !== currentBooking.roomId ||
      booking.occurrenceId !== currentBooking.occurrenceId
  );

export const filterRelatedBookings = (
  bookings: BookingsEventResponse[],
  filter: RelatedBookingFilter,
  now: number
): BookingsEventResponse[] => {
  return bookings
    .filter((booking) => {
      switch (filter) {
        case "upcoming":
          return booking.end.getTime() > now;

        case "previous":
          return booking.end.getTime() <= now;

        case "all":
          return true;
      }
    })
    .sort((a, b) => {
      const difference = a.start.getTime() - b.start.getTime();

      return (
        (filter === "previous" ? -difference : difference) ||
        a.roomId.localeCompare(b.roomId) ||
        a.occurrenceId.localeCompare(b.occurrenceId)
      );
    });
};
