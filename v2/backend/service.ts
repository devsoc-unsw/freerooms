import { getBuildingData, getScraperData, getWeek } from "./helpers";
import { BuildingData, BuildingRoomStatus, RoomAvailability } from "./types";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FIFTEEN_MIN = 15 * 1000 * 60;

export const getAllBuildings = async (): Promise<BuildingData[]> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }
  // Omit rooms property, img is not sent for now
  const res: BuildingData[] = [];
  data.forEach(({ name, id, img, rooms }) => {
    res.push({
      name: name,
      id: id,
      img: ''
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
  const buildingRooms = buildingData[buildingID].rooms;

  const scraperData = await getScraperData();
  const week = await getWeek(scraperData, date);
  const day = days[date.getDay()];

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
  const buildingRooms = buildingData[buildingID].rooms;
  if (!(buildingRooms.includes(roomNumber))) {
    throw new Error(`Room ID ${buildingID}-${roomNumber} does not exist`);
  }

  const scraperData = await getScraperData();
  // Unsure what to do if building/room has no listed classes
  // if (
  //   !(buildingID in scraperData) ||
  //   !(roomNumber in scraperData[buildingID])
  // ) {
  //   return {roomName: ''};
  // }
  return scraperData[buildingID][roomNumber];
};
