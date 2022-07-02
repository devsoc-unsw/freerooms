import axios from "axios";
import pkg from "jsdom";
import { ScraperData } from "./types";
const { JSDOM } = pkg;

/*
 * Definitions
 */
const API = "https://timetable.csesoc.app"

const TERM_DATE_FETCH = `${API}/api/startdate/freerooms`;
const TERM_ID_FETCH = `${API}/api/availableterm`;

const TERM_ID_LENGTH = 2;

const ROOM_URL =
  "https://www.learningenvironments.unsw.edu.au/find-teaching-space?building_name=&room_name=&page=";

const MAX_PAGES = 13;

const DATE_REGEX = /(\d{2})\/(\d{2})\/(\d{4})/;
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
export const getStartDate = async () => {
  const termDateFetch = await axios.get(TERM_DATE_FETCH);
  const termDateRes = await termDateFetch.data;

  if (DATE_REGEX.test(termDateRes)) {
    return termDateRes;
  } else {
    throw new Error(`Start Date retrieved incorrectly`);
  }
}

export const getData = async (): Promise<ScraperData> => {
  const termIdFetch = await axios.get(TERM_ID_FETCH);
  const termIdRes = await termIdFetch.data;

  let termNum;
  let termYear;

  if (termIdRes.length === TERM_ID_LENGTH) {
    termNum = `T${parseInt(termIdRes.substring(1))}`;
  } else {
    termNum = `Summer`;
  }

  const termDateRes = await getStartDate();
  if (termDateRes != null) {
    termYear = termDateRes.substring(6);
  } 

  const termId = `${termYear}-${termNum}`;
  const SCRAPER_URL = `${API}/api/terms/${termId}/freerooms`;

  const res = await axios.get(SCRAPER_URL);
  const data = (await res.data) as ScraperData;
  return data;
};

// Gets all the room codes for rooms in UNSW by parsing the HTML with regex (please excuse my cardinal sin)
export const getAllRoomIDs = async () => {
  // hello this is a bit slow! is there a way that we could move this to a background process
  // that fetches like every x hours on our server, instead of doing this per request?

  let roomIDs: string[] = [];

  const fs = require('fs');
  const stats = fs.statSync('database.json');
  const modTime = stats.mtime;
  let timeNow = new Date();

  // check if database.json has been updated within the month
  if (timeNow.getFullYear() - modTime.getFullYear() > 0 || timeNow.getMonth() - modTime.getMonth() > 0) {
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
    fs.writeFileSync("database.json", dictString);
  } else {
    let rawData = fs.readFileSync('database.json');
    let data = JSON.parse(rawData)
    roomIDs = data["roomIDs"]
  }

  return roomIDs;
};

// Gets the week number from the date
export const getWeek = async (data: ScraperData, date: Date) => {
  // In 'DD/MM/YYYY' format
  const termStart = await getStartDate();
  // console.log(termStart);

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
