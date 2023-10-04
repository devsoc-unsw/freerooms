import { getTimezoneOffset } from "date-fns-tz";

const USER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Take a Date created in local time and converts it to Sydney time.
 *
 * The conversion logic may look a little backwards, but consider that a time in
 * UTC+10 actually occurs 10 hours before the same time in UTC. So, to convert
 * from 6PM UTC to 6PM AEST we need to subtract 10 hours.
 *
 * Example:
 *  We've created a Date at 6PM in the local TZ, say UTC-4 - this is 10PM UTC.
 *  This function will convert it to 6PM Sydney time i.e. 8AM UTC.
 *  We do this by adding -4 (local offset) and subtracting 10 (syd offset) hours
 */
const toSydneyTime = (date: Date): Date => {
  const sydOffset = getTimezoneOffset('Australia/Sydney', date);
  const userOffset = getTimezoneOffset(USER_TZ, date);

  // Add user offset to force UTC then subtract syd offset to force Sydney time
  return new Date(date.getTime() + userOffset - sydOffset);
}

export default toSydneyTime;