import { calculateStatus, getBuildingData, getScraperData, getWeek } from "./helpers";
import { BuildingsReturnData, Filters, RoomAvailability, BuildingStatus, RoomsReturnData } from "./types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const UPPER = 19; // Buildings with grid 19+ are upper campus

export const getAllBuildings = async (): Promise<BuildingsReturnData[]> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }

  const res: BuildingsReturnData[] = [];
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

export const getAllRoomStatus = async (
  date: Date,
  filters: Filters
): Promise<RoomsReturnData> => {
  const week = await getWeek(date);
  const day = DAYS[date.getDay()];

  const buildingData = await getBuildingData();
  const scraperData = await getScraperData();
  const result: RoomsReturnData = {};
  for (const buildingID in buildingData) {
    const roomGrid = parseInt(buildingID.substring(3));
    const roomLocation = roomGrid < UPPER ? 'lower' : 'upper';
    if (filters.location && filters.location != roomLocation) continue;

    const buildingRooms = buildingData[buildingID].rooms;
    const buildingStatus: BuildingStatus = {};
    for (const roomNumber in buildingRooms) {
      const roomData = buildingRooms[roomNumber];
      if (
        (filters.capacity && roomData.capacity < filters.capacity) ||
        (filters.usage && roomData.usage != filters.usage)
      ) {
        // Skip room if it does not match filter
        continue;
      }
  
      if (
        !(buildingID in scraperData) ||
        !(roomNumber in scraperData[buildingID]) ||
        !(week in scraperData[buildingID][roomNumber]) ||
        !(day in scraperData[buildingID][roomNumber][week])
      ) {
        // If no data for this room on this day, it is free
        buildingStatus[roomNumber] = {
          status: "free",
          endtime: "",
        };
        continue;
      }
  
      const classes = scraperData[buildingID][roomNumber][week][day];
      const status = calculateStatus(date, classes, filters.duration || 0);
      if (status !== null) {
        buildingStatus[roomNumber] = status;
      }
    }
    result[buildingID] = buildingStatus;
  }

  return result;
};

export const getRoomAvailability = async (
  buildingID: string,
  roomNumber: string
): Promise<RoomAvailability> => {
  // Check if room exists in database
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  if (!(roomNumber in buildingData[buildingID].rooms)) {
    throw new Error(`Room ID ${buildingID}-${roomNumber} does not exist`);
  }

  const scraperData = await getScraperData();
  if (
    !(buildingID in scraperData) ||
    !(roomNumber in scraperData[buildingID])
  ) {
    return { name: buildingData[buildingID].rooms[roomNumber].name };
  } else {
    return scraperData[buildingID][roomNumber];
  }
};
