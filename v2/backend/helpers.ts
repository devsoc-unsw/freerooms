import axios from "axios";
import child_process from "child_process";
import fs from "fs";
import { ScraperData, BuildingDatabase, RoomStatus, ClassList } from "./types";

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
  let data;

  // If database.json missing, create it
  if (!fs.existsSync('database.json')) {
    data = await scrapeBuildingData();
  } else {
    const rawData = fs.readFileSync('database.json', 'utf8');
    data = JSON.parse(rawData) as BuildingDatabase;
  }

  return data;
}

// Spawn child process to scrape building data
// or return promise to ongoing process
let ongoingScraper: Promise<BuildingDatabase> | null = null;
export const scrapeBuildingData = async (): Promise<BuildingDatabase> => {
  if (ongoingScraper === null) {
    ongoingScraper = new Promise((resolve, reject) => {
      const dev = process.env.NODE_ENV !== "production";
      const scraper_path = dev ? './scraper.ts' : 'dist/scraper.js';
      const child = child_process.fork(scraper_path);
      child.on('message', (msg: { data: BuildingDatabase, err?: string }) => {
        if (msg.err) reject(msg.err);
        resolve(msg.data);
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

// Parses the provided datetime from the request params
export const getDate = (datetime: string): Date | null => {
  let timestamp = Date.parse(datetime);
  return isNaN(timestamp) ? null : new Date(datetime);
};

// Return a copy of provided date set to provided time
// Time must be in the format HH:MM
export const combineDateTime = (date: Date, time: string) => {
  const newDate = new Date(date.valueOf());
  const [hours, minutes] = time.split(':');
  newDate.setHours(+hours, +minutes);
  return newDate;
}

// Given a datetime and a list of the room's bookings for the,
// corresponding date, calculate the status of the room
// If room if not free for the given minimum duration, return null
export const calculateStatus = (
  datetime: Date,
  classes: ClassList,
  minDuration: number
): RoomStatus | null => {
  let roomStatus: RoomStatus = {
    status: "free",
    endtime: "",
  };

  let currTime = datetime.getTime();
  for (const eachClass of classes) {
    let classStart = combineDateTime(datetime, eachClass['start']);
    let classStartTime = classStart.getTime();

    let classEnd = combineDateTime(datetime, eachClass['end']);
    let classEndTime = classEnd.getTime();

    if (roomStatus.status === 'free' && currTime < classStartTime) {
      // If room is free at current time and this class is after
      const duration = (classStartTime - currTime) / (1000 * 60);
      if (duration < minDuration) {
        return null;
      } else {
        return roomStatus;
      }
    } else if (currTime >= classStartTime && currTime < classEndTime) {
      if (minDuration > 0) return null;

      // If class occuring at current time, check if ending soon
      if (classEndTime - datetime.getTime() <= FIFTEEN_MIN) {
        roomStatus.status = "soon";
      } else {
        roomStatus.status = "busy";
      }
      roomStatus.endtime = classEnd.toISOString();

      // Continue looping forward to check for consecutive classes
      currTime = classEndTime;
    }
  }

  return roomStatus;
}