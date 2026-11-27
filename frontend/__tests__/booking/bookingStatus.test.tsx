import { getBookingStatus } from "@frontend/utils/bookingStatus";

const booking = {
  start: new Date("2026-01-04T22:00:00Z"),
  end: new Date("2026-01-05T00:00:00Z"),
};

describe("getBookingStatus", () => {
  it("identifies upcoming bookings", () => {
    expect(getBookingStatus(booking, new Date("2026-01-04T20:36:00Z"))).toEqual(
      {
        state: "upcoming",
        label: "Starts in 1 hour 24 minutes",
        progress: null,
      }
    );
  });

  it("identifies ongoing bookings", () => {
    expect(getBookingStatus(booking, new Date("2026-01-04T23:18:00Z"))).toEqual(
      {
        state: "ongoing",
        label: "42 minutes remaining",
        progress: 65,
      }
    );
  });

  it("identifies completed bookings", () => {
    expect(getBookingStatus(booking, new Date("2026-01-05T02:00:00Z"))).toEqual(
      {
        state: "completed",
        label: "Ended 2 hours ago",
        progress: null,
      }
    );
  });

  it("treats the exact start time as ongoing", () => {
    expect(getBookingStatus(booking, booking.start)).toEqual({
      state: "ongoing",
      label: "2 hours remaining",
      progress: 0,
    });
  });

  it("treats the exact end time as completed", () => {
    expect(getBookingStatus(booking, booking.end)).toEqual({
      state: "completed",
      label: "Ended just now",
      progress: null,
    });
  });

  it("rounds remaining time upwards", () => {
    expect(
      getBookingStatus(booking, new Date("2026-01-04T23:59:45Z")).label
    ).toBe("1 minute remaining");
  });

  it("handles bookings starting in several days", () => {
    expect(
      getBookingStatus(booking, new Date("2026-01-02T18:45:00Z")).label
    ).toBe("Starts in 2 days 3 hours");
  });

  it("handles bookings that ended less than a minute ago", () => {
    expect(
      getBookingStatus(booking, new Date("2026-01-05T00:00:30Z")).label
    ).toBe("Ended just now");
  });
});
