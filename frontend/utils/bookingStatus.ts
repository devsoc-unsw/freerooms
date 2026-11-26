import { Booking } from "common/types";

export type BookingStatus = {
  state: "upcoming" | "ongoing" | "completed";
  label: string;
  progress: number | null;
};

const MINUTE_MS = 60 * 1000;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = MINUTES_PER_HOUR * 24;

const formatDuration = (totalMinutes: number): string => {
  const days = Math.floor(totalMinutes / MINUTES_PER_DAY);
  const hours = Math.floor((totalMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;

  const units = [
    { value: days, label: "day" },
    { value: hours, label: "hour" },
    { value: minutes, label: "minute" },
  ];

  return units
    .filter(({ value }) => value > 0)
    .slice(0, 2)
    .map(({ value, label }) => `${value} ${label}${value === 1 ? "" : "s"}`)
    .join(" ");
};

export const getBookingStatus = (
  booking: Pick<Booking, "start" | "end">,
  now: Date,
): BookingStatus => {
  const start = booking.start.getTime();
  const end = booking.end.getTime();
  const current = now.getTime();

  if (current < start) {
    const minutesUntil = Math.ceil((start - current) / MINUTE_MS);

    return {
      state: "upcoming",
      label: `Starts in ${formatDuration(minutesUntil)}`,
      progress: null,
    };
  }

  if (current >= end) {
    const minutesSince = Math.floor((current - end) / MINUTE_MS);

    return {
      state: "completed",
      label:
        minutesSince === 0
          ? "Ended just now"
          : `Ended ${formatDuration(minutesSince)} ago`,
      progress: null,
    };
  }

  const minutesRemaining = Math.ceil((end - current) / MINUTE_MS);

  const progress = ((current - start) / (end - start)) * 100;

  return {
    state: "ongoing",
    label: `${formatDuration(minutesRemaining)} remaining`,
    progress,
  };
};
