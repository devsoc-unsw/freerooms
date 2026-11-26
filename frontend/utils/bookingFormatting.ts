import { BookingType } from "common/types";
import { formatInTimeZone } from "date-fns-tz";

const bookingTypeLabels: Record<BookingType, string> = {
  [BookingType.LECTURE]: "Lecture",
  [BookingType.TUTORIAL]: "Tutorial",
  [BookingType.LABORATORY]: "Laboratory",
  [BookingType.TUTORIAL_LABORATORY]: "Tutorial / Laboratory",
  [BookingType.WORKSHOP]: "Workshop",
  [BookingType.SEMINAR]: "Seminar",
  [BookingType.STUDIO]: "Studio",
  [BookingType.CLASS]: "Class",
  [BookingType.EXAMS]: "Exam",
  [BookingType.SOCIETY]: "Society",
  [BookingType.INTERNAL]: "Internal",
  [BookingType.BLOCK]: "Block Booking",
  [BookingType.MISC]: "Miscellaneous",
  [BookingType.OTHER]: "Other",
};

export const getBookingTypeLabel = (bookingType: string): string => {
  const type = Object.values(BookingType).find((type) => type === bookingType);

  return type ? bookingTypeLabels[type] : "Other";
};

const BOOKING_TIMEZONE = "Australia/Sydney";

export const formatBookingDate = (date: Date): string =>
  formatInTimeZone(date, BOOKING_TIMEZONE, "EEEE, d MMMM yyyy");

export const formatBookingTime = (date: Date): string =>
  formatInTimeZone(date, BOOKING_TIMEZONE, "h:mm aaa");

export const formatBookingDateRange = (start: Date, end: Date): string => {
  const startDate = formatBookingDate(start);
  const endDate = formatBookingDate(end);

  return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
};

export const formatBookingTimeRange = (start: Date, end: Date): string => {
  const startTime = formatBookingTime(start);
  const endTime = formatBookingTime(end);

  const startOffset = formatInTimeZone(start, BOOKING_TIMEZONE, "xxx");

  const endOffset = formatInTimeZone(end, BOOKING_TIMEZONE, "xxx");

  // Daylight savings changing
  if (startOffset !== endOffset) {
    return `${startTime} (UTC${startOffset}) to ${endTime} (UTC${endOffset})`;
  }

  return `${startTime} - ${endTime}`;
};
