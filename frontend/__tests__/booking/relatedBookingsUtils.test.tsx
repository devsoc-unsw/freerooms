import {
  excludeCurrentBooking,
  filterRelatedBookings,
} from "@frontend/utils/relatedBookings";
import type { BookingsEventResponse } from "common/types";

const now = new Date("2026-01-15T00:00:00Z").getTime();

const makeBooking = (
  occurrenceId: string,
  start: string,
  end: string,
  roomId = "K-F17-LG3",
): BookingsEventResponse => ({
  occurrenceId,
  roomId,
  eventId: "event-1",
  name: "COMP2521 LEC",
  bookingType: "LECTURE",
  start: new Date(start),
  end: new Date(end),
  plannedSize: 250,
});

const previous1 = makeBooking(
  "previous-1",
  "2026-01-05T00:00:00Z",
  "2026-01-05T02:00:00Z",
);

const previous2 = makeBooking(
  "previous-2",
  "2026-01-12T00:00:00Z",
  "2026-01-12T02:00:00Z",
);

const ongoing = makeBooking(
  "ongoing",
  "2026-01-14T23:00:00Z",
  "2026-01-15T01:00:00Z",
);

const upcoming1 = makeBooking(
  "upcoming-1",
  "2026-01-19T00:00:00Z",
  "2026-01-19T02:00:00Z",
);

const upcoming2 = makeBooking(
  "upcoming-2",
  "2026-02-02T00:00:00Z",
  "2026-02-02T02:00:00Z",
);

const bookings = [upcoming2, previous1, upcoming1, previous2, ongoing];

describe("excludeCurrentBooking", () => {
  it("excludes the current booking", () => {
    expect(excludeCurrentBooking(bookings, previous1)).not.toContain(previous1);
  });

  it("preserves the same occurrence in another room", () => {
    const differentRoom = {
      ...previous1,
      roomId: "K-F10-713",
    };

    expect(
      excludeCurrentBooking([previous1, differentRoom], previous1),
    ).toEqual([differentRoom]);
  });
});

describe("filterRelatedBookings", () => {
  it("sorts upcoming sessions earliest first", () => {
    expect(filterRelatedBookings(bookings, "upcoming", now)).toEqual([
      ongoing,
      upcoming1,
      upcoming2,
    ]);
  });

  it("sorts previous sessions most recent first", () => {
    expect(filterRelatedBookings(bookings, "previous", now)).toEqual([
      previous2,
      previous1,
    ]);
  });

  it("sorts all sessions chronologically", () => {
    expect(filterRelatedBookings(bookings, "all", now)).toEqual([
      previous1,
      previous2,
      ongoing,
      upcoming1,
      upcoming2,
    ]);
  });

  it("treats the exact end time as previous", () => {
    expect(
      filterRelatedBookings([previous1], "previous", previous1.end.getTime()),
    ).toEqual([previous1]);
  });

  it("does not mutate the original array", () => {
    const original = [...bookings];

    filterRelatedBookings(bookings, "all", now);

    expect(bookings).toEqual(original);
  });

  it("handles an empty session list", () => {
    expect(filterRelatedBookings([], "upcoming", now)).toEqual([]);
  });

  it("sorts simultaneous sessions deterministically", () => {
    const first = {
      ...previous1,
      roomId: "K-D23-201",
    };

    const second = {
      ...previous1,
      roomId: "K-D23-203",
    };

    expect(filterRelatedBookings([second, first], "all", now)).toEqual([
      first,
      second,
    ]);
  });
});
