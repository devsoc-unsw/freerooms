import {
  Booking,
  BookingsResponse,
  RoomStatus,
  RoomUtilitiesResponse,
} from "@common/types";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import {
  queryBookingsInRange,
  queryBuildingsAndRooms,
  queryRoomUtilities,
} from "./dbInterface";
import { BuildingDatabase, SearchFilters } from "./types";
import { start } from "repl";

const FIFTEEN_MIN = 15 * 1000 * 60;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

// Get all bookings for a certain date
export const getBookingsForDate = async (
  date: Date
): Promise<{ [roomId: string]: BookingsResponse }> => {
  // The date is in UTC time, convert to AEST first to manipulate hours
  const base = utcToZonedTime(date, "Australia/Sydney");
  base.setHours(0, 0);
  const start = zonedTimeToUtc(base, "Australia/Sydney");
  base.setHours(23, 59);
  const end = zonedTimeToUtc(base, "Australia/Sydney");

  const res = await queryBookingsInRange(start, end);
  return Object.fromEntries(res.rooms.map((room) => [room.id, room]));
};

export const getBookingsFromStartTime = async (startTime: Date) => {
  // The date is in UTC time, convert to AEST first to manipulate hours
  const base = utcToZonedTime(startTime, "Australia/Sydney");
  base.setHours(23, 59);
  const endTime = zonedTimeToUtc(base, "Australia/Sydney");
  const res = await queryBookingsInRange(startTime, endTime);
  return Object.fromEntries(res.rooms.map((room) => [room.id, room]));
};

export const getsearchRangeEnd = (
  start: Date,
  filters: SearchFilters
): Date => {
  if (filters.recurring) {
    const weeksAhead = filters.recurring - 1;
    return new Date(start.getTime() + weeksAhead * ONE_WEEK + (filters.duration || 0) * 60 * 1000);
  }

  const base = utcToZonedTime(start, "Australia/Sydney");
  base.setHours(23, 59);
  return zonedTimeToUtc(base, "Australia/Sydney");
};

export const getBuildingRoomData = async (): Promise<BuildingDatabase> => {
  const res = await queryBuildingsAndRooms();
  return Object.fromEntries(
    res.buildings.map((building) => [
      building.id,
      {
        ...building,
        rooms: Object.fromEntries(
          building.rooms.map((room) => [room.id.split("-")[2], room])
        ),
      },
    ])
  );
};

// Gets the utilities data for a room
export const getRoomUtilities = async (
  roomId: string
): Promise<RoomUtilitiesResponse> => {
  const res = await queryRoomUtilities(roomId);
  return res.rooms_by_pk;
};

// Given a datetime and a list of the room's bookings for
// the corresponding date, calculate the status of the room
// If room is not free for the given minimum duration, return null
export const calculateStatus = (
  datetime: Date,
  classes: Booking[],
  minDuration: number
): RoomStatus | null => {
  const roomStatus: RoomStatus = {
    status: "free",
    endtime: "",
  };

  // Sort classes by start time, then end time.
  classes.sort((a, b) => {
    if (a.start != b.start) {
      return a.start < b.start ? -1 : 1;
    } else {
      return a.end < b.end ? -1 : 1;
    }
  });

  // Find the first class that *ends* after the current time
  const firstAfter = classes.find((cls) => cls.end >= datetime);
  if (!firstAfter) {
    // No such class, it is free indefinitely
    // There exists no times today where it is unavailable, and endtime is ""
    return roomStatus;
  }

  const start = firstAfter.start;
  if (datetime < start) {
    // Class starts after current time
    const duration = (start.getTime() - datetime.getTime()) / (1000 * 60);
    if (duration < minDuration) {
      // Doesn't meet min duration filter
      return null;
    } else {
      // Add endtime of the free class i.e. the beginning of the firstClass after.
      roomStatus.endtime = firstAfter.start.toISOString();
    }
  } else {
    // Class starts before current time i.e. class occurring now
    if (minDuration > 0) return null;

    // Find the first gap between classes where class is free.
    let i = 1;
    for (; i < classes.length; i++) {
      const currStart = classes[i].start;
      const prevEnd = classes[i - 1].end;
      if (prevEnd > datetime && currStart > prevEnd) {
        roomStatus.endtime = classes[i - 1].end.toISOString();
        break;
      }
    }
    if (i == classes.length) {
      // There exist no gaps at all; Thus the endtime is the endtime of the last class.
      roomStatus.endtime = classes[classes.length - 1].end.toISOString();
    }

    // Determine if the end time is soon or not
    if (
      new Date(roomStatus.endtime).getTime() - datetime.getTime() <=
      FIFTEEN_MIN
    ) {
      roomStatus.status = "soon";
    } else {
      roomStatus.status = "busy";
    }
  }

  return roomStatus;
};

// Checks if a specific time slot is available.
export const isSlotFree = (
  start: Date,
  duration: number,
  bookings: Booking[]
): boolean => {
  const end = new Date(start.getTime() + duration * 60 * 1000);

  // return true if specific timeframe has no bookings at all.
  return !bookings.some((booking) => {
    return start < booking.end && end > booking.start;
  });
};

// Checks if a room is available at the chosen time for multiple weeks.
// Used for the recurring filter feature
export const isRecurringFree = (
  start: Date,
  duration: number,
  bookings: Booking[],
  weeks: number
): boolean => {
  for (let i = 0; i < weeks; i++) {
    const occurence = new Date(start);
    occurence.setDate(start.getDate() + i * 7);

    if (!isSlotFree(occurence, duration, bookings)) {
      return false;
    }
  }
  return true;
};

// Gets all bookings affecting rooms within a given datetime range.
export const getBookingsForRange = async (start: Date, end: Date) => {
  const res = await queryBookingsInRange(start, end);
  return Object.fromEntries(res.rooms.map((room) => [room.id, room]));
};
