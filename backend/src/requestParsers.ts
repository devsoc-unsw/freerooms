import { roomUsages } from "@common/roomUsages";
import { Request } from "express";

import { SearchFilters, StatusFilters } from "./types";

const ISO_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

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
      endTime: parseDatetime(req.query.datetime as string),
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
  }

  return filters;
};
