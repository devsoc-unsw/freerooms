import {
  formatBookingCareer,
  formatBookingDate,
  formatBookingDateRange,
  formatBookingTerm,
  formatBookingTime,
  formatBookingTimeRange,
  getBookingTypeLabel,
  getPlannedAttendance,
} from "@frontend/utils/bookingFormatting";
import getBookingHref from "@frontend/utils/getBookingHref";
import { BookingType } from "common/types";

describe("getBookingTypeLabel", () => {
  it.each([
    [BookingType.LECTURE, "Lecture"],
    [BookingType.LABORATORY, "Laboratory"],
    [BookingType.TUTORIAL_LABORATORY, "Tutorial / Laboratory"],
    [BookingType.SOCIETY, "Society"],
    [BookingType.EXAMS, "Exam"],
    [BookingType.MISC, "Miscellaneous"],
  ])("formats %s as %s", (type, expected) => {
    expect(getBookingTypeLabel(type)).toBe(expected);
  });

  it("handles unknown booking types", () => {
    expect(getBookingTypeLabel("UNKNOWN_TYPE")).toBe("Other");
  });

  it("handles an empty booking type", () => {
    expect(getBookingTypeLabel("")).toBe("Other");
  });
});

describe("getBookingHref", () => {
  it("creates a deterministic booking URL", () => {
    expect(getBookingHref("K-F17-LG3", "occurrence-123")).toBe(
      "/booking/K-F17-LG3/occurrence-123",
    );
  });

  it("encodes identifiers", () => {
    expect(getBookingHref("room/123", "occurrence 456")).toBe(
      "/booking/room%2F123/occurrence%20456",
    );
  });

  it("distinguishes occurrences in different rooms", () => {
    expect(getBookingHref("K-D23-201", "occurrence-123")).not.toBe(
      getBookingHref("K-D23-203", "occurrence-123"),
    );
  });
});

describe("Booking date and time formatting", () => {
  it("formats a booking date in Sydney time", () => {
    expect(formatBookingDate(new Date("2026-01-04T22:00:00Z"))).toBe(
      "Monday, 5 January 2026",
    );
  });

  it("handles Sydney summer daylight saving", () => {
    expect(formatBookingTime(new Date("2026-01-04T22:00:00Z"))).toBe("9:00 am");
  });

  it("handles Sydney winter standard time", () => {
    expect(formatBookingTime(new Date("2026-07-05T22:00:00Z"))).toBe("8:00 am");
  });

  it("does not duplicate the date for same-day bookings", () => {
    expect(
      formatBookingDateRange(
        new Date("2026-01-04T22:00:00Z"),
        new Date("2026-01-05T00:00:00Z"),
      ),
    ).toBe("Monday, 5 January 2026");
  });

  it("displays both dates for overnight bookings", () => {
    expect(
      formatBookingDateRange(
        new Date("2026-01-05T12:00:00Z"),
        new Date("2026-01-05T14:00:00Z"),
      ),
    ).toBe("Monday, 5 January 2026 to Tuesday, 6 January 2026");
  });

  it("formats the booking time range", () => {
    expect(
      formatBookingTimeRange(
        new Date("2026-01-04T22:00:00Z"),
        new Date("2026-01-05T00:00:00Z"),
      ),
    ).toBe("9:00 am - 11:00 am");
  });

  it("disambiguates times across daylight saving changes", () => {
    expect(
      formatBookingTimeRange(
        new Date("2026-04-04T15:30:00Z"),
        new Date("2026-04-04T16:30:00Z"),
      ),
    ).toBe("2:30 am (UTC+11:00) to 2:30 am (UTC+10:00)");
  });
});

describe("getPlannedAttendance", () => {
  it("preserves positive planned attendance", () => {
    expect(getPlannedAttendance(250)).toBe(250);
  });

  it("treats zero as unspecified attendance", () => {
    expect(getPlannedAttendance(0)).toBeUndefined();
  });

  it("handles null planned attendance", () => {
    expect(getPlannedAttendance(null)).toBeUndefined();
  });

  it("handles missing planned attendance", () => {
    expect(getPlannedAttendance(undefined)).toBeUndefined();
  });
});

describe("formatBookingTerm", () => {
  it.each([
    ["U1", "Summer Term"],
    ["T1", "Term 1"],
    ["T2", "Term 2"],
    ["T3", "Term 3"],
    ["T1A", "Term 1A"],
    ["T2B", "Term 2B"],
    ["T3C", "Term 3C"],
    ["S1", "Semester 1"],
    ["S2", "Semester 2"],
    [" t1 ", "Term 1"],
    ["UNKNOWN", "UNKNOWN"],
  ])("formats %s as %s", (term, expected) => {
    expect(formatBookingTerm(term)).toBe(expected);
  });

  it.each([null, undefined, "", " "])("handles missing terms: %s", (term) => {
    expect(formatBookingTerm(term)).toBeUndefined();
  });
});

describe("formatBookingCareer", () => {
  it.each([
    ["UGRD", "Undergraduate"],
    ["PGRD", "Postgraduate"],
    [" ugrd ", "Undergraduate"],
    ["UNKNOWN", "UNKNOWN"],
  ])("formats %s as %s", (career, expected) => {
    expect(formatBookingCareer(career)).toBe(expected);
  });

  it.each([null, undefined, "", " "])(
    "handles missing careers: %s",
    (career) => {
      expect(formatBookingCareer(career)).toBeUndefined();
    },
  );
});
