import { Request } from "express";
import { calculateStatus, getBuildingData, getTimetableData, getWeek } from "./helpers";
import { BuildingsResponse, Filters, RoomBookings, BuildingStatus, RoomsResponse } from "./types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const UPPER = 19; // Buildings with grid 19+ are upper campus

export const getAllBuildings = async (): Promise<BuildingsResponse> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }

  const res: BuildingsResponse = [];
  data.forEach(({ name, id, lat, long }) => {
    res.push({
      name: name,
      id: id,
      lat: lat,
      long: long,
    });
  });
  return res;
};

// Parses the provided datetime from the request params
export const parseDate = (req: Request): Date => {
  const datetimeString = req.query.datetime as string;
  if (!datetimeString) {
    return new Date();
  }
  const timestamp = Date.parse(datetimeString);
  if (isNaN(timestamp)) {
    throw new Error('Invalid datetime');
  }
  return new Date(datetimeString);
};

// Parses the provided filters from the request params
export const parseFilters = (req: Request): Filters => {
  const filters: Filters = {};

  if (req.query.capacity) {
    const capacity = parseInt(req.query.capacity as string);
    if (isNaN(capacity) || capacity < 0) {
      throw new Error('Invalid capacity');
    }
    filters.capacity = capacity;
  }

  if (req.query.duration) {
    const duration = parseInt(req.query.duration as string);
    if (isNaN(duration) || duration < 0) {
      throw new Error('Invalid duration');
    }
    filters.duration = duration;
  }

  if (req.query.usage) {
    const usage = req.query.usage as string;
    if (usage !== 'LEC' && usage !== 'TUT') {
      throw new Error('Invalid usage: must be one of "LEC" or "TUT"');
    }
    filters.usage = usage;
  }

  if (req.query.location) {
    const location = req.query.location as string;
    if (location !== 'upper' && location !== 'lower') {
      throw new Error('Invalid location: must be one of "upper" or "lower"');
    }
    filters.location = location;
  }

  return filters;
};

export const getAllRoomStatus = async (
  date: Date,
  filters: Filters
): Promise<RoomsResponse> => {
  const week = await getWeek(date);
  const day = DAYS[date.getDay()];

  const buildingData = await getBuildingData();
  const timetableData = await getTimetableData();
  const result: RoomsResponse = {};
  for (const buildingID in buildingData) {
    // Skip building if it does not match filter
    const roomLocation = +buildingID.substring(3) < UPPER ? 'lower' : 'upper';
    if (filters.location && filters.location != roomLocation) {
      result[buildingID] = {};
      continue;
    }

    const buildingRooms = buildingData[buildingID].rooms;
    const buildingStatus: BuildingStatus = {};
    for (const roomNumber in buildingRooms) {
      const roomData = buildingRooms[roomNumber];

      // Skip room if it does not match filter
      if (
        (filters.capacity && roomData.capacity < filters.capacity) ||
        (filters.usage && roomData.usage != filters.usage)
      ) {
        continue;
      }
      
      // If no data for this room on this day, it is free
      if (
        !(buildingID in timetableData) ||
        !(roomNumber in timetableData[buildingID]) ||
        !(week in timetableData[buildingID][roomNumber]) ||
        !(day in timetableData[buildingID][roomNumber][week])
      ) {
        buildingStatus[roomNumber] = {
          status: "free",
          endtime: "",
        };
        continue;
      }
  
      const classes = timetableData[buildingID][roomNumber][week][day];
      const status = calculateStatus(date, classes, filters.duration || 0);
      if (status !== null) {
        buildingStatus[roomNumber] = status;
      }
    }
    result[buildingID] = buildingStatus;
  }

  return result;
};

export const getRoomBookings = async (
  buildingID: string,
  roomNumber: string
): Promise<RoomBookings> => {
  // Check if room exists in database
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  if (!(roomNumber in buildingData[buildingID].rooms)) {
    throw new Error(`Room ID ${buildingID}-${roomNumber} does not exist`);
  }

  // If in timetable, return bookings, otherwise just return name from database
  const timetableData = await getTimetableData();
  return !(buildingID in timetableData) || !(roomNumber in timetableData[buildingID])
   ? { name: buildingData[buildingID].rooms[roomNumber].name }
   : timetableData[buildingID][roomNumber];
};
