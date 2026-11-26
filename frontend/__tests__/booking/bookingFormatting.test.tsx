import { getBookingTypeLabel } from "@frontend/utils/bookingFormatting";
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
      "/booking/K-F17-LG3/occurrence-123"
    );
  });

  it("encodes identifiers", () => {
    expect(getBookingHref("room/123", "occurrence 456")).toBe(
      "/booking/room%2F123/occurrence%20456"
    );
  });

  it("distinguishes occurrences in different rooms", () => {
    expect(getBookingHref("K-D23-201", "occurrence-123")).not.toBe(
      getBookingHref("K-D23-203", "occurrence-123")
    );
  });
});
