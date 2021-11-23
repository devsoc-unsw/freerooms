// All logic should go in here.
// All functions in this file should take in some params from index.ts and spit out an object of some sort
import buildingData from "./buildings";
import { getData, getAllRooms, getWeek } from "./helpers";
import { BuildingRoomStatus } from "./interfaces";
import {
  BuildingData,
  RoomAvailability,
  RoomStatus,
  ScraperData,
} from "./types";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getAllBuildings = async (): Promise<BuildingData[]> => {
  const data = Object.values(buildingData);
  if (data.length > 0) {
    return data;
  } else {
    throw new Error(`Buildings cannot be retrieved`);
  }
};

export const getAllRoomStatus = async (
  buildingId: string,
  date: Date
): Promise<BuildingRoomStatus> => {
  const data: ScraperData = await getData();
  if (!(buildingId in data)) {
    throw new Error(`Building id ${buildingId} does not exist`);
  }

  const roomStatus: BuildingRoomStatus = { rooms: {} };
  const buildingData = data[buildingId];
  const roomCodes = await getAllRooms();

  for (const roomId of roomCodes) {
    const [campus, building, room] = roomId.split("-");
    if (buildingId !== `${campus}-${building}`) continue;

    const roomData = buildingData[room];
    const week = getWeek(data, date);
    const currDayIndex = date.getDay();
    const day = days[currDayIndex];
    if (
      !(room in buildingData) ||
      !(week in roomData) ||
      !(day in roomData[week])
    ) {
      roomStatus.rooms[room] = {
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
      const FIFTEEN_MIN = 15 * 1000 * 60;

      if (currTime >= classStart && currTime < classEnd) {
        isFree = false;

        if (classEnd - currTime <= FIFTEEN_MIN) {
          roomStatus.rooms[room] = {
            status: "soon",
            endtime: eachClass["end"],
          };
        } else {
          roomStatus.rooms[room] = {
            status: "busy",
            endtime: eachClass["end"],
          };
        }
        currTime = classEnd;
      }
    }

    if (isFree) {
      roomStatus.rooms[room] = {
        status: "free",
        endtime: "",
      };
    }
  }
  return roomStatus;
};

export const getRoomAvailability = async (
  buildingId: string,
  roomId: string
) => {
  const data = await getData();

  // check buildingId is valid
  if (!(buildingId in data)) {
    throw new Error(`Building id ${buildingId} does not exist`);
  }

  // check roomId is valid
  if (!(roomId in data[buildingId])) {
    throw new Error(`Room id ${roomId} does not exist`);
  }

  const roomAvailabilities = data[buildingId][roomId];

  return roomAvailabilities;
};
