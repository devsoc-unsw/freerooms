// All logic should go in here.
// All functions in this file should take in some params from index.ts and spit out an object of some sort
import fetch from "node-fetch";
import pkg from "jsdom";
import { BuildingRoomStatus } from "./interfaces";
import { ScraperData } from "./types";
const { JSDOM } = pkg;

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T3/freerooms/";

export const getData = async (): Promise<ScraperData> => {
  const res = await fetch(SCRAPER_URL);
  const data = (await res.json()) as ScraperData;
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
    const response = await fetch(ROOM_URL + i);
    const data = await response.text();

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

export const getWeek = async (date: Date) => {
  const dataJson = await getData();
  // In 'DD/MM/YYYY' format
  const termStart = dataJson["termStart"];

  const termStartDate = new Date(termStart);
  const today = date;

  const diff = today.getTime() - termStartDate.getTime();

  //Calculate days since start of term
  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  //Integer division to get term number
  //Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

// Gets all the room status and end time in a building
export const getAllRoomStatus = async (
  buildingId: string,
  date: Date
): Promise<BuildingRoomStatus> => {
  const data: ScraperData = await getData();
  // check building id exists
  if (!(buildingId in data)) {
    throw new Error(`Building id ${buildingId} does not exist`);
  }

  const ret: BuildingRoomStatus = { rooms: {} };
  const buildingData = data[buildingId];
  const roomCodes = await getAllRooms();
  for (const roomId in roomCodes) {
    const roomData = buildingData[roomId];
    // Room does not have a class (free)
    if (!(roomId in buildingData)) {
      ret.rooms[roomId] = {
        status: "free",
        endtime: "",
      };
      continue;
    }
    const week = await getWeek(date);
    // Room does not have a class in that week
    if (!(week in roomData)) {
      ret.rooms[roomId] = {
        status: "free",
        endtime: "",
      };
      continue;
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currDay = date.getDay();
    const day = days[currDay];

    const currTime = date.getTime();
    // Room does not have a class on that day
    if (!(day in roomData[week])) {
      ret.rooms[roomId] = {
        status: "free",
        endtime: "",
      };
      continue;
    }

    // Room has a class, check if the room is free soon
    // case when the room is about to be free in 15 mins
    // but the next class starts when the class ends
    let isFree = true;
    for (const eachClass of roomData[week][day]) {
      // loop through each room in case another class starts just as this class
      const classStart = new Date(eachClass["start"]).getTime();
      const classEnd = new Date(eachClass["end"]).getTime();
      const FIFTEEN_MIN = 15 * 1000 * 60;
      // Time is in between the class
      if (currTime >= classStart && currTime < classEnd) {
        isFree = false;
        // There are <= 15 min left until class ends
        if (classEnd - currTime <= FIFTEEN_MIN) {
          // room is free soon
          ret.rooms[roomId] = {
            status: "soon",
            endtime: eachClass["end"],
          };
        } else {
          ret.rooms[roomId] = {
            status: "busy",
            endtime: eachClass["end"],
          };
        }
        break;
      }
    }

    if (isFree) {
      ret.rooms[roomId] = {
        status: "free",
        endtime: "",
      };
    }
  }
  return ret;
};
