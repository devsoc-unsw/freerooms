import { roomUsages } from "@common/roomUsages";
import {
  BookingsResponse,
  BuildingsResponse,
  RoomsResponse,
  StatusResponse,
} from "@common/types";
import { Request } from "express";

import { queryBookingsForRoom } from "./dbInterface";
import {
  calculateStatus,
  getBookingsForDate,
  getBuildingRoomData,
} from "./helpers";
import { Filters } from "./types";

const ISO_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
const UPPER = 19; // Buildings with grid 19+ are upper campus

export const getAllBuildings = async (): Promise<BuildingsResponse> => {
  const data = Object.values(await getBuildingRoomData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }

  const res: BuildingsResponse = { buildings: [] };
  data.forEach(({ name, id, lat, long, aliases }) => {
    res.buildings.push({ name, id, lat, long, aliases });
  });
  return res;
};

export const getAllRooms = async (): Promise<RoomsResponse> => {
  const data = Object.values(await getBuildingRoomData());
  if (!data) {
    throw new Error(`Rooms cannot be retrieved`);
  }

  const res: RoomsResponse = { rooms: {} };
  data.forEach((bldg) =>
    Object.values(bldg.rooms).forEach((room) => {
      res.rooms[room.id] = room;
    })
  );
  return res;
};

// Parses the provided datetime from the request params
export const parseDatetime = (req: Request): Date => {
  const datetimeString = req.query.datetime as string;
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

// Parses the provided filters from the request params
export const parseFilters = (req: Request): Filters => {
  const filters: Filters = {};

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

export const getAllRoomStatus = async (
  date: Date,
  filters: Filters
): Promise<StatusResponse> => {
  const bookings = await getBookingsForDate(date);
  const buildingData = await getBuildingRoomData();

  const result: StatusResponse = {};
  for (const buildingId in buildingData) {
    // Skip building if it does not match filter
    const roomLocation = +buildingId.substring(3) < UPPER ? "lower" : "upper";
    if (filters.location && filters.location != roomLocation) {
      result[buildingId] = {};
      continue;
    }

    const buildingRooms = buildingData[buildingId].rooms;
    result[buildingId] = {};
    for (const roomNumber in buildingRooms) {
      const roomData = buildingRooms[roomNumber];

      // Skip room if it does not match filter
      if (
        (filters.capacity && roomData.capacity < filters.capacity) ||
        (filters.usage && roomData.usage != filters.usage) ||
        (filters.id != undefined && (roomData.school != " ") != filters.id) // id is required if managed by a school (non-CATS)
      )
        continue;

      const status = calculateStatus(
        date,
        bookings[roomData.id].bookings,
        filters.duration || 0
      );
      if (status !== null) {
        result[buildingId][roomNumber] = status;
      }
    }
  }

  return result;
};

export const getRoomBookings = async (
  roomId: string
): Promise<BookingsResponse> => {
  const res = await queryBookingsForRoom(roomId);
  if (res.rooms_by_pk === null) {
    throw new Error(`Room ID ${roomId} does not exist`);
  }

  return res.rooms_by_pk;
};
