import buildingData from "./buildings";
import { getData, getAllRoomIDs, getWeek } from "./helpers";
import { BuildingData, BuildingRoomStatus, RoomAvailability } from "./types";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FIFTEEN_MIN = 15 * 1000 * 60;

export const getAllBuildings = async (): Promise<BuildingData[]> => {
  const data = Object.values(buildingData);
  if (data.length > 0) {
    return data;
  } else {
    throw new Error(`Buildings cannot be retrieved`);
  }
};

export const getAllRoomStatus = async (
  buildingID: string,
  date: Date
): Promise<BuildingRoomStatus> => {
  const scraperData = await getData();
  const buildingData = scraperData[buildingID];
  const roomIDs = await getAllRoomIDs();

  const roomStatus: BuildingRoomStatus = {};

  for (const roomID of roomIDs) {
    const [campus, buildingGrid, roomNumber] = roomID.split("-");
    if (buildingID !== `${campus}-${buildingGrid}`) continue;

    const roomData = buildingData[roomNumber];
    const week = await getWeek(scraperData, date);
    const day = days[date.getDay()];
    if (
      !(roomNumber in buildingData) ||
      !(week in roomData) ||
      !(day in roomData[week])
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
    for (const eachClass of roomData[week][day]) {
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

  if (Object.keys(roomStatus).length === 0) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }

  return roomStatus;
};

export const getRoomAvailability = async (
  buildingID: string,
  roomNumber: string
): Promise<RoomAvailability> => {
  const data = await getData();

  if (!(buildingID in data)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  } else if (!(roomNumber in data[buildingID])) {
    throw new Error(`Building ID ${roomNumber} does not exist`);
  }

  return data[buildingID][roomNumber];
};