import axios from "axios";
import child_process from "child_process";
import fs from "fs";

import { DATABASE_PATH, SCRAPER_PATH } from "./config";
import { ScraperData, BuildingDatabase, RoomStatus, Class } from "./types";

/*
 * Definitions
 */
const API = "https://timetable.csesoc.app"

const TERM_DATE_FETCH = `${API}/api/startdate/freerooms`;
const TERM_ID_FETCH = `${API}/api/currentterm`;

const TERM_ID_LENGTH = 2;
const DATE_REGEX = /(\d{2})\/(\d{2})\/(\d{4})/;

const FIFTEEN_MIN = 15 * 1000 * 60;

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

export const getScraperData = async (): Promise<ScraperData> => {
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

export const getBuildingData = async (): Promise<BuildingDatabase> => {
  const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
  const data = JSON.parse(rawData) as BuildingDatabase;
  return data;
}

// Spawn child process to scrape building data
// or return promise to ongoing process
let ongoingScraper: Promise<void> | null = null;
export const scrapeBuildingData = async (): Promise<void> => {
  if (ongoingScraper === null) {
    ongoingScraper = new Promise((resolve, reject) => {
      const child = child_process.fork(SCRAPER_PATH);
      child.on('message', (msg: { err?: any }) => {
        if (msg.err) reject(msg.err);
        resolve();
      });
      child.on('error', () => {
        reject();
      });
      child.on('exit', () => {
        ongoingScraper = null;
      });
    });
  }

  return ongoingScraper;
}

// Gets the week number from the date
export const getWeek = async (date: Date) => {
  // In 'DD/MM/YYYY' format
  const termStart = await getStartDate();
  const [day, month, year] = termStart.split('/');
  const termStartDate = new Date(+year, +month - 1, day);
  const today = date;

  const diff = today.getTime() - termStartDate.getTime();

  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  // Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

// Given a datetime and a list of the room's bookings for 
// the corresponding date, calculate the status of the room
// If room if not free for the given minimum duration, return null
export const calculateStatus = (
  datetime: Date,
  classes: Class[],
  minDuration: number
): RoomStatus | null => {
  const roomStatus: RoomStatus = {
    status: "free",
    endtime: "",
  };

  // Find the first two class that end after the given time
  let firstAfter: Class | null = null;
  let secondAfter: Class | null = null;
  for (const cls of classes) {
    const end = combineDateTime(datetime, cls.end);
    if (end <= datetime) continue;

    if (!firstAfter || end < combineDateTime(datetime, firstAfter.end)) {
      secondAfter = firstAfter;
      firstAfter = cls;
    } else if (!secondAfter || end < combineDateTime(datetime, secondAfter.end)) {
      secondAfter = cls;
    }
  }

  if (!firstAfter) {
    // No such class, it is free indefinitely
    return roomStatus;
  }

  const start = combineDateTime(datetime, firstAfter.start);
  if (datetime < start) {
    // Class starts after current time i.e. room is free, check if it meets minDuration filter
    const duration = (start.getTime() - datetime.getTime()) / (1000 * 60);
    return duration < minDuration ? null : roomStatus;
  } else {
    // Class starts before current time i.e. class occurring now
    if (minDuration > 0) return null;
    roomStatus.status = "busy";

    const end = combineDateTime(datetime, firstAfter.end);
    if (end.getTime() - datetime.getTime() <= FIFTEEN_MIN) {
      // Ending soon, check the next class
      if (!secondAfter || combineDateTime(datetime, secondAfter.start) > end) {
        // No next class, or it starts after the current class ends
        roomStatus.status = "soon";
        roomStatus.endtime = end.toISOString();
      }
    }
  }

  return roomStatus;
}

// Return a copy of provided date set to provided time
// Time must be in the format HH:MM
const combineDateTime = (date: Date, time: string) => {
  const newDate = new Date(date.valueOf());
  const [hours, minutes] = time.split(':');
  newDate.setHours(+hours, +minutes);
  return newDate;
}
