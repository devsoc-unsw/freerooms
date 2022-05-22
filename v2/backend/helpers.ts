import axios from "axios";
import pkg from "jsdom";
import { ScraperData } from "./types";
const { JSDOM } = pkg;

/*
 * Definitions
 */
const SCRAPER_URL = "https://timetable.csesoc.app/api/terms/2022-T1/freerooms/";
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

/*
 * Implementation
 */

export const getData = async (): Promise<ScraperData> => {
  const res = await axios.get(SCRAPER_URL);
  const data = (await res.data) as ScraperData;
  return data;
};

// Gets all the room codes for rooms in UNSW by parsing the HTML with regex (please excuse my cardinal sin)
export const getAllRoomIDs = async () => {
  // hello this is a bit slow! is there a way that we could move this to a background process
  // that fetches like every x hours on our server, instead of doing this per request?

  let roomIDs: string[] = [];
  console.log("hiiii");

  let roomPromises: Promise<any>[] = [];
  for (let i = 0; i < MAX_PAGES; i++) {
    roomPromises.push(axios.get(ROOM_URL + i));
  }

  await Promise.all(roomPromises).then((responses) => {
    responses.forEach((response) => {
      const htmlDoc = new JSDOM(response.data);
      const rawRoomIDs =
        htmlDoc.window.document.getElementsByClassName("field-item");
      if (!rawRoomIDs) return roomIDs;
      const cleanRoomIDs = [];
      for (let j = 0; j < rawRoomIDs.length; j++) {
        let roomID = rawRoomIDs.item(j)?.innerHTML;
        if (roomID && ROOM_REGEX.test(roomID)) {
          cleanRoomIDs.push(roomID);
        }
      }
      roomIDs = roomIDs.concat(cleanRoomIDs);
    });
  });

  const dict = {"roomIDs": roomIDs};
  const dictString = JSON.stringify(dict);
  const fs = require('fs');
  fs.writeFile("database.json", dictString);
  console.log("hello");
  
  return roomIDs;
};

// Gets the week number from the date
export const getWeek = (data: ScraperData, date: Date): number => {
  // In 'DD/MM/YYYY' format
  const termStart = data["termStart"];

  const termStartDate = new Date(termStart);
  const today = date;

  const diff = today.getTime() - termStartDate.getTime();

  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  // Integer division to get term number
  // Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

// Parses the provided datetime from the request params
export const getDate = (datetime: string): Date | null => {
  let timestamp = Date.parse(datetime);
  return isNaN(timestamp) ? null : new Date(datetime);
};
