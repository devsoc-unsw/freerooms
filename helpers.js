import axios from "axios";
import pkg from "jsdom";
const { JSDOM } = pkg;

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T1/freerooms/";

export const getData = async () => {
  const res = await axios.get(SCRAPER_URL);
  const data = await res.data;
  return data;
};

// Gets all the room codes for rooms in UNSW by parsing the HTML with regex (please excuse my cardinal sin)
export const getAllRoomIDs = async () => {
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

  let roomIDs = [];

  for (let i = 0; i < MAX_PAGES; i++) {
    const response = await axios.get(ROOM_URL + i);
    const data = await response.data;

    const htmlDoc = new JSDOM(data);
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
  }

  return roomIDs;
};

// Gets the week number from the date
export const getWeek = (data, date) => {
  // In 'DD/MM/YYYY' format
  const termStart = data["termStart"];

  const termStartDate = new Date(convertToIsoString(termStart));
  const today = date;

  const diff = today.getTime() - termStartDate.getTime();

  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  // Integer division to get term number
  // Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

// Parses the provided datetime from the request params
export const getDate = (datetime) => {
  let timestamp = Date.parse(datetime);
  return isNaN(timestamp) ? null : new Date(datetime);
};

export const convertToIsoString = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

export const parseTimeToDate = (date, timeString) => {
  const d = new Date(date);
  const [hour, min] = timeString.split(":");
  d.setHours(hour);
  d.setMinutes(min);
  return d;
};
