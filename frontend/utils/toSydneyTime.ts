import { toZonedTime } from "date-fns-tz";

export const SYDNEY_TIMEZONE = "Australia/Sydney";

/**
 * Convert given time to Sydney time zone
 */
const toSydneyTime = (date: Date): Date => {
  return toZonedTime(date, SYDNEY_TIMEZONE);
};

export default toSydneyTime;
