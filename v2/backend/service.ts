import { getBuildingData, getScraperData, getWeek } from "./helpers";
import { BuildingReturnData, BuildingRoomStatus, RoomAvailability } from "./types";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FIFTEEN_MIN = 15 * 1000 * 60;

export const getAllBuildings = async (): Promise<BuildingReturnData[]> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }
  // Omit rooms property, img is not sent for now
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
  date: Date
): Promise<BuildingRoomStatus> => {
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  const buildingRooms = Object.keys(buildingData[buildingID].rooms);

  const week = await getWeek(date);
  const day = days[date.getDay()];

  const scraperData = await getScraperData();
  const roomStatus: BuildingRoomStatus = {};
  for (const roomNumber of buildingRooms) {
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

    // Room has a class currently, check if the room is free soon
    // There is a case when the room is about to be free in 15 mins
    // but the next class starts when the current class ends
    // TODO test this lol
    let currTime = date.getTime();
    let isFree = true;
    for (const eachClass of scraperData[buildingID][roomNumber][week][day]) {
      const classStart = new Date(eachClass["start"]).getTime();
      const classEnd = new Date(eachClass["end"]).getTime();

      if (currTime >= classStart && currTime < classEnd) {
        isFree = false;

        if (classEnd - currTime <= FIFTEEN_MIN) {
          roomStatus[roomNumber] = {
            status: "soon",
            endtime: eachClass["end"],
          };
        } else {
          roomStatus[roomNumber] = {
            status: "busy",
            endtime: eachClass["end"],
          };
        }
        currTime = classEnd;
      }
    }

    if (isFree) {
      roomStatus[roomNumber] = {
        status: "free",
        endtime: "",
      };
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
