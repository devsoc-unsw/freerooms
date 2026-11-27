import { roomUsages } from "common/roomUsages";
import {
  BookingCursor,
  BookingFilter,
  BookingSort,
  bookingSorts,
  BookingType,
} from "common/types";
import { Request } from "express";

import { SearchFilters, StatusFilters } from "./types";

const ISO_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 50;

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

// Convert comma based filters to seperate
const parseFilterValues = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  error: string,
): T[] => {
  if (typeof value !== "string") {
    throw new Error(error);
  }

  const values = value.split(",").map((v) => v.trim());

  const parsed = values.map((v) => {
    const match = allowed.find((option) => option === v);

    if (match === undefined) {
      throw new Error(error);
    }

    return match;
  });

  return [...new Set(parsed)].sort();
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

  if (req.query.usage !== undefined) {
    filters.usage = parseFilterValues(
      req.query.usage,
      Object.keys(roomUsages),
      "Invalid room usage",
    );
  }

  if (req.query.location !== undefined) {
    filters.location = parseFilterValues(
      req.query.location,
      ["upper", "lower"] as const,
      "Invalid location",
    );
  }

  if (req.query.id !== undefined) {
    filters.id = parseFilterValues(
      req.query.id,
      ["true", "false"] as const,
      "Invalid ID required",
    ).map((value) => value === "true");
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
        "Invalid time range: end time cannot be 1 week later than start time.",
      );
    }
    filters = { ...filters, ...startAndEndTime };
    if (
      startAndEndTime.endTime.getTime() - startAndEndTime.startTime.getTime() <
      0
    ) {
      throw new Error(
        "Invalid time range: end time cannot be before start time.",
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
        `Invalid limit: must be a positive integer no greater than ${MAX_LIMIT}`,
      );
    }
  }
  return limit;
};

export const parseBookingFilters = (req: Request): BookingFilter | null => {
  const filters: BookingFilter = {};

  if (req.query.startTime) {
    filters.startTime = parseDatetime(req.query.startTime as string);
  }

  if (req.query.endTime) {
    filters.endTime = parseDatetime(req.query.endTime as string);
  }

  if (req.query.bookingType !== undefined) {
    filters.bookingType = parseFilterValues(
      req.query.bookingType,
      Object.values(BookingType),
      "Invalid booking type",
    );
  }

  if (req.query.plannedSize) {
    const plannedSize = parseInt(req.query.plannedSize as string);
    if (isNaN(plannedSize) || plannedSize < 0) {
      throw new Error("Invalid planned size");
    }
    filters.plannedSize = plannedSize;
  }

  if (req.query.location !== undefined) {
    filters.location = parseFilterValues(
      req.query.location,
      ["upper", "lower"] as const,
      "Invalid location",
    );
  }

  return Object.keys(filters).length > 0 ? filters : null;
};

export const parseBookingSort = (req: Request): BookingSort => {
  const sort = req.query.sort as string | undefined;

  // Default sort if not provided
  if (!sort) return "ascendingStart";

  if (!bookingSorts.includes(sort as BookingSort)) {
    throw new Error("Invalid sort option");
  }

  return sort as BookingSort;
};

export const parseBookingSearch = (req: Request): string | null => {
  const search = req.query.search ? (req.query.search as string).trim() : null;

  if (search !== null && search.length === 0) {
    throw new Error("Invalid search: search term cannot be empty");
  }

  return search;
};

export const parseBookingCursor = (req: Request): BookingCursor | null => {
  if (!req.query.cursor) return null;

  try {
    const cursor = req.query.cursor;
    if (typeof cursor !== "string") {
      throw new Error("Cursor must be a string");
    }
    const cursorObj = JSON.parse(req.query.cursor as string);

    if (
      !cursorObj.start ||
      !cursorObj.end ||
      !cursorObj.name ||
      cursorObj.plannedSize === undefined ||
      !cursorObj.bookingType ||
      !cursorObj.roomId ||
      !cursorObj.occurrenceId
    ) {
      throw new Error("Cursor is missing required fields");
    }

    if (
      cursorObj.plannedSize !== null &&
      (typeof cursorObj.plannedSize !== "number" ||
        !Number.isFinite(cursorObj.plannedSize))
    ) {
      throw new Error("Invalid planned size in cursor");
    }

    return {
      start: new Date(cursorObj.start),
      end: new Date(cursorObj.end),
      name: cursorObj.name,
      plannedSize: cursorObj.plannedSize,
      bookingType: cursorObj.bookingType as BookingType,
      roomId: cursorObj.roomId,
      occurrenceId: cursorObj.occurrenceId,
      filter: cursorObj.filter || null,
      sort: cursorObj.sort || null,
      search: cursorObj.search || null,
    };
  } catch {
    throw new Error("Invalid cursor format");
  }
};
