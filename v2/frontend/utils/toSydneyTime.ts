/**
 * This function converts from user local time to Sydney time.
 * 
 * When a user selects a date and time (e.g. 4pm 3/4/2023) this is read in as if
 * in the user's local time. However, we want this selection to correspond to
 * 4pm 3/4/2023 in Sydney time, as backend expects accurate times.
 */
const toSydneyTime = (date: Date): Date => {
    // Get the Sydney time offset for the date (either 10 or 11 in DST)
    // This is negative, because e.g. 10am in UTC+10 occurs 10 hrs *before* 10am in UTC
    const sydOffset = -(isInSydneyDST(date) ? 11 : 10) * 60 * 60 * 1000;

    // Get the timezone offset of the user's passed in date
    const userOffset = date.getTimezoneOffset() * 60 * 1000;

    // Subtract user offset to force UTC then add syd offset to force Sydney time
    return new Date(date.getTime() - userOffset + sydOffset);
}

/**
 * Returns true if the date is before the first sunday in April (excl)
 * or after the first sunday in October (incl), false otherwise
 */
const isInSydneyDST = (date: Date): boolean => {
    const year = date.getFullYear();
    const monthIdx = date.getMonth();
    const dayOfMonth = date.getDate();
    if (monthIdx < 3 || monthIdx > 9) {
        // Before April/after October - definitely in DST
        return true;
    } else if (monthIdx > 3 && monthIdx < 9) {
        // Between April and October - definitely not in DST
        return false;
    } else if (monthIdx == 3) {
        // In April - in DST if before the first sunday
        return date.getDate() < getFirstSunday(year, monthIdx);
    } else {
        // In October - in DST if after the first sunday
        return dayOfMonth >= getFirstSunday(year, monthIdx);
    }
}

/**
 * Returns the day of the month of the first Sunday of the given month in year
 */
const getFirstSunday = (year: number, monthIdx: number): number => {
    // Create a new date object for the first day of the given month
    const firstDayOfMonth = new Date(year, monthIdx, 1);
  
    // Calculate the day of the week (0-6, where 0 = Sunday)
    const dayOfWeek = firstDayOfMonth.getDay();
  
    // Calculate the number of days to the first Sunday of the month
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  
    // First Sunday is `daysToSunday` days after 1st of month
    return 1 + daysToSunday;
}

export default toSydneyTime;