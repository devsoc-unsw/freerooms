import {
  BookingsResponse,
  BuildingsResponse,
  RoomsResponse,
  SearchResponse,
  StatusResponse,
} from "@common/types";

import { queryBookingsForRoom } from "./dbInterface";
import {
  calculateStatus,
  getBookingsForDate,
  getBookingsFromStartTime,
  getBuildingRoomData,
} from "./helpers";
import { SearchFilters, StatusFilters } from "./types";

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

export const getAllRoomStatus = async (
  date: Date,
  filters: StatusFilters
): Promise<StatusResponse> => {
  const bookings = await getBookingsForDate(date);
  const buildingData = await getBuildingRoomData();

  const result: StatusResponse = {};
  for (const buildingId in buildingData) {
    // Skip building if it does not match filter
    const roomLocation = +buildingId.substring(3) < UPPER ? "lower" : "upper";
    if (filters.location && filters.location != roomLocation) {
      result[buildingId] = { numAvailable: 0, roomStatuses: {} };
      continue;
    }

    const buildingRooms = buildingData[buildingId].rooms;
    result[buildingId] = { numAvailable: 0, roomStatuses: {} };
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
        result[buildingId].numAvailable += 1;
        result[buildingId].roomStatuses[roomNumber] = status;
      }
    }
  }

  return result;
};

export const searchAllRoom = async (
  date: Date,
  filters: SearchFilters
): Promise<SearchResponse> => {
  const bookings = await getBookingsFromStartTime(date);

  const buildingData = await getBuildingRoomData();
  const result: SearchResponse = {};

  for (const buildingId in buildingData) {
    const roomLocation = +buildingId.substring(3) < UPPER ? "lower" : "upper";
    if (filters.location && filters.location != roomLocation) {
      continue;
    }

    const buildingRooms = buildingData[buildingId].rooms;
    for (const roomNumber in buildingRooms) {
      const roomData = buildingRooms[roomNumber];
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

      if (status === null) {
        continue;
      }

      result[`${buildingId}-${roomNumber}`] = {
        ...status,
        name: roomData.name,
      };
    }
  }

  for (const roomId of Object.keys(result)) {
    if (result[roomId].status === "busy") {
      delete result[roomId];
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
