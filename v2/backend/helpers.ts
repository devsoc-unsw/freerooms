import axios from "axios";
import pkg from "jsdom";
const { JSDOM } = pkg;

import { ScraperData } from "./types";

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T1/freerooms/";

export const getData = async (): Promise<ScraperData> => {
  const res = await axios.get(SCRAPER_URL);
  const data = (await res.data) as ScraperData;
  return data;
};

// Gets all the room codes for rooms in UNSW by parsing the HTML with regex (please excuse my cardinal sin)
export const getAllRooms = async (): Promise<string[]> => {
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

    if (!roomCodes) return rooms;

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

export const getWeek = (data: ScraperData, date: Date): number => {
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

export const getDate = (datetime: string): Date | null => {
  let timestamp = Date.parse(datetime);
  return isNaN(timestamp) ? null : new Date(datetime);
};
