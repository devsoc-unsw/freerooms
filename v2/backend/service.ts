import { calculateStatus, combineDateTime, getBuildingData, getScraperData, getWeek } from "./helpers";
import { BuildingReturnData, Class, ClassList, Filters, RoomAvailability, RoomStatus, RoomStatusReturnData } from "./types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const UPPER = 19; // Buildings with grid 19+ are upper campus

export const getAllBuildings = async (): Promise<BuildingReturnData[]> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }

  const res: BuildingReturnData[] = [];
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
  buildingID: string,
  date: Date,
  filters: Filters
): Promise<RoomStatusReturnData> => {
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  const buildingRooms = Object.keys(buildingData[buildingID].rooms);

  const week = await getWeek(date);
  const day = DAYS[date.getDay()];

  const scraperData = await getScraperData();
  const roomStatus: RoomStatusReturnData = {};
  for (const roomNumber of buildingRooms) {
    // Skip room if it does not match filter
    const roomData = buildingData[buildingID].rooms[roomNumber];
    const roomGrid = parseInt(buildingID.substring(3));
    const roomLocation = roomGrid < UPPER ? 'lower' : 'upper';
    if (
      roomData.capacity < filters.capacity ||
      (filters.usage && roomData.usage != filters.usage) ||
      (filters.location && filters.location != roomLocation)
    ) {
      continue;
    }

    // If no data for this room on this day, it is free
    if (
      !(buildingID in scraperData) ||
      !(roomNumber in scraperData[buildingID]) ||
      !(week in scraperData[buildingID][roomNumber]) ||
      !(day in scraperData[buildingID][roomNumber][week])
    ) {
      roomStatus[roomNumber] = {
        status: "free",
        endtime: "",
      };
      continue;
    }

    const classes: ClassList =
      scraperData[buildingID][roomNumber][week][day]
    const status = calculateStatus(date, classes, filters.duration);
    if (status !== null) {
      roomStatus[roomNumber] = status;
    }
  }

  return roomStatus;
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
