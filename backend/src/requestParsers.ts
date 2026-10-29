import { roomUsages } from "@common/roomUsages";
import { BookingCursor, BookingType } from "@common/types";
import { Request } from "express";

import { SearchFilters, StatusFilters } from "./types";

const ISO_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 50;
const DEFAULT_BOOKING_SORT = ["start", "bookingType", "roomId", "occurrenceId"];

const parseDatetime = (datetimeString: string | undefined | null): Date => {
  if (!datetimeString) {
    return new Date();
  }

  if (!ISO_REGEX.test(datetimeString)) {
    throw new Error("Date must be in ISO format");
  }

  const ms = Date.parse(datetimeString);
  if (isNaN(ms)) {
    throw new Error("Invalid datetime");
  }

  return new Date(ms);
};

// Parses the provided datetime from the request params
export const parseStatusDatetime = (req: Request): Date => {
  return parseDatetime(req.query.datetime as string);
};

// Parses the provided filters from the request params
export const parseStatusFilters = (req: Request): StatusFilters => {
  const filters: StatusFilters = {};

  if (req.query.capacity) {
    const capacity = parseInt(req.query.capacity as string);
    if (isNaN(capacity) || capacity < 0) {
      throw new Error("Invalid capacity");
    }
    filters.capacity = capacity;
  }

  if (req.query.duration) {
    const duration = parseInt(req.query.duration as string);
    if (isNaN(duration) || duration < 0) {
      throw new Error("Invalid duration");
    }
    filters.duration = duration;
  }

  if (req.query.recurring) {
    const recurring = parseInt(req.query.recurring as string);

    if (isNaN(recurring) || recurring < 1 || recurring > 10) {
      throw new Error("Invalid recurring filter");
    }
    filters.recurring = recurring;
  }

  if (req.query.usage) {
    const usage = req.query.usage as string;
    if (!Object.keys(roomUsages).includes(usage)) {
      throw new Error("Invalid room usage");
    }
    filters.usage = usage;
  }

  if (req.query.location) {
    const location = req.query.location as string;
    if (location !== "upper" && location !== "lower") {
      throw new Error('Invalid location: must be one of "upper" or "lower"');
    }
    filters.location = location;
  }

  if (req.query.id) {
    const id = req.query.id as string;
    if (id !== "true" && id !== "false") {
      throw new Error('Invalid ID required: must be one of "true" or "false"');
    }
    filters.id = id === "true";
  }

  return filters;
};

export const parseSearchFilters = (req: Request): SearchFilters => {
  // we may want to make SearchFilters independent from StatusFilters if SearchFilters does not completely extends it anymore.
  let filters: SearchFilters = parseStatusFilters(req);

  if (req.query.buildingId) {
    filters.buildingId = req.query.buildingId as string;
  }

  // limit the startTime and endTime to be within a week from each other
  // seeing that we have 200k+ bookings
  if (req.query.startTime && req.query.endTime) {
    const startAndEndTime = {
      startTime: parseDatetime(req.query.startTime as string),
      endTime: parseDatetime(req.query.endTime as string),
    };

    if (
      startAndEndTime.endTime.getTime() - startAndEndTime.startTime.getTime() >
      ONE_WEEK_IN_MILLISECONDS
    ) {
      throw new Error(
        "Invalid time range: end time cannot be 1 week later than start time."
      );
    }
    filters = { ...filters, ...startAndEndTime };
    if (
      startAndEndTime.endTime.getTime() - startAndEndTime.startTime.getTime() <
      0
    ) {
      throw new Error(
        "Invalid time range: end time cannot be before start time."
      );
    }
    filters = { ...filters, ...startAndEndTime };
  }

  return filters;
};

export const parseBookingLimit = (req: Request): number => {
  let limit = DEFAULT_LIMIT;
  if (req.query.limit) {
    limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
      throw new Error(
        `Invalid limit: must be a positive integer no greater than ${MAX_LIMIT}`
      );
    }
  }
  return limit;
};

export const parseBookingCursor = (req: Request): BookingCursor | null => {
  if (!req.query.cursor) return null;

  try {
    const cursorObj = JSON.parse(req.query.cursor as string);

    // Check booking types enum
    if (!Object.values(BookingType).includes(cursorObj.bookingType)) {
      throw new Error("Invalid booking type in cursor");
    }

    const cursor: BookingCursor = {
      start: new Date(cursorObj.start),
      bookingType: cursorObj.bookingType,
      roomId: cursorObj.roomId,
      occurrenceId: cursorObj.occurrenceId,
      filter: cursorObj.filter ?? null,
      sort: Array.isArray(cursorObj.sort) ? cursorObj.sort : [],
      search: cursorObj.search ?? null,
    };

    if (
      isNaN(cursor.start.getTime()) ||
      !cursor.bookingType ||
      !cursor.roomId ||
      !cursor.occurrenceId
    ) {
      throw new Error("Invalid cursor fields");
    }

    return cursor;
  } catch {
    throw new Error("Invalid cursor");
  }
};

export const parseBookingFilters = (
  req: Request,
  cursor: BookingCursor | null
): { filters: string[]; cursor: BookingCursor | null } => {
  const filters: string[] = req.query.filters
    ? (req.query.filters as string).split(",")
    : [];

  // Reset cursor if filters and cursor filters do not match
  if (cursor && cursor.filter) {
    if (
      filters.length !== cursor.filter.length ||
      filters.some((field, index) => field !== cursor.filter[index])
    ) {
      return {
        filters,
        cursor: null,
      };
    }
  }

  return { filters, cursor };
};

// Parse sorting for bookings
export const parseBookingSort = (
  req: Request,
  cursor: BookingCursor | null
): {
  sort: string[];
  cursor: BookingCursor | null;
} => {
  const sort = req.query.sort
    ? (req.query.sort as string).split(",")
    : DEFAULT_BOOKING_SORT;

  // Reset cursor if sort and cursor sort do not match
  if (cursor && cursor.sort) {
    if (
      sort.length !== cursor.sort.length ||
      sort.some((field, index) => field !== cursor.sort[index])
    ) {
      return {
        sort,
        cursor: null,
      };
    }
  }

  return { sort, cursor };
};

// Parse a search for booking name
export const parseBookingSearch = (
  req: Request,
  cursor: BookingCursor | null
): { search: string | null; cursor: BookingCursor | null } => {
  const search = req.query.search ? (req.query.search as string).trim() : null;

  if (search !== null && search.length === 0) {
    throw new Error("Invalid search: search term cannot be empty");
  }

  // Reset cursor if search and cursor search do not match
  if (cursor && cursor.search !== search) {
    return { search, cursor: null };
  }

  return { search, cursor };
};
