// All logic should go in here.
// All functions in this file should take in some params from index.ts and spit out an object of some sort
import axios from "axios";
import pkg from "jsdom";
const { JSDOM } = pkg;
import { BuildingRoomStatus } from "./interfaces";
import { ScraperData } from "./types";

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T1/freerooms/";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getData = async (): Promise<ScraperData> => {
  const res = await axios.get(SCRAPER_URL);
  const data = await res.data as ScraperData;
  return data;
};

// Gets all the room codes
export const getAllRooms = async () => {
  const ROOM_URL =
    "https://www.learningenvironments.unsw.edu.au/find-teaching-space?building_name=&room_name=&page=";

  const MAX_PAGES = 13;

  const ROOM_REGEX = /^[A-Z]-[A-Z][0-9]{1,2}-[A-Z]{0,2}[0-9]{1,4}[A-Z]{0,1}$/;
  // One letter - campus ID, e.g. K for Kensington
  // One letter followed by one or two numbers for grid reference e.g. D16 or F8
  // Zero, one or two letters for the floor then between one to four numbers for the room number
  // Library rooms may end in a letter
  // Zero letter floor - 313
  // One letter floor - M18
  // Two letter floor - LG19

  let rooms: string[] = [];

  for (let i = 0; i < MAX_PAGES; i++) {
    const response = await axios.get(ROOM_URL + i);
    const data = await response.data;

    const htmlDoc = new JSDOM(data);
    const roomCodes =
      htmlDoc.window.document.getElementsByClassName("field-item");

    if (!roomCodes) {
      return rooms;
    }
    const cleanRoomCodes = [];

    for (let j = 0; j < roomCodes.length; j++) {
      let roomCode = roomCodes.item(j)?.innerHTML;
      if (roomCode && ROOM_REGEX.test(roomCode)) {
        cleanRoomCodes.push(roomCode);
      }
    }

    rooms = rooms.concat(cleanRoomCodes);
  }

  return rooms;
};

export const getWeek = (data: ScraperData, date: Date) => {
  // In 'DD/MM/YYYY' format
  const termStart = data["termStart"];

  const termStartDate = new Date(termStart);
  const today = date;

  const diff = today.getTime() - termStartDate.getTime();

  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  //Integer division to get term number
  //Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

export const getDate = (datetime: string) => {
  let timestamp = Date.parse(datetime);
  return isNaN(timestamp) ? null : new Date(datetime);
}

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
    const [campus, building, room] = roomId.split('-');
    if (buildingId !== `${campus}-${building}`) continue;

    const roomData = buildingData[roomId];
    const week = getWeek(data, date);
    const currDayIndex = date.getDay();
    const day = days[currDayIndex];
    if (!(roomId in buildingData) || !(week in roomData) || !(day in roomData[week])) {
      roomStatus.rooms[roomId] = {
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
          roomStatus.rooms[roomId] = {
            status: "soon",
            endtime: eachClass["end"],
          };
        } else {
          roomStatus.rooms[roomId] = {
            status: "busy",
            endtime: eachClass["end"],
          };
        }
        currTime = classEnd;
      }
    }

    if (isFree) {
      roomStatus.rooms[roomId] = {
        status: "free",
        endtime: "",
      };
    }
  }
  return roomStatus;
};
