import axios from "axios";
import child_process from "child_process";
import fs from "fs";
import { DateTime } from "luxon";

import { DATABASE_PATH, SCRAPER_PATH } from "./config";
import { TimetableData, BuildingDatabase, RoomStatus, Class } from "./types";

const TIMETABLE_API = "https://timetable.csesoc.app/api"
const DATE_REGEX = new RegExp(/\d{2}\/\d{2}\/\d{4}/);
const FIFTEEN_MIN = 15 * 1000 * 60;

// Fetch start date of current term from the Timetable API
// Result is in DD/MM/YYYY format
export const getStartDate = async (): Promise<string> => {
  const termDateFetch = await axios.get(`${TIMETABLE_API}/startdate/freerooms`);
  const termDateRes = termDateFetch.data as string;

  if (DATE_REGEX.test(termDateRes)) {
    return termDateRes;
  } else {
    throw new Error(`Start date retrieved incorrectly`);
  }
}

// Fetch timetable data from the Timetable API
export const getTimetableData = async (): Promise<TimetableData> => {
  const termNumRes = await axios.get(`${TIMETABLE_API}/currentterm`);
  const termNum = termNumRes.data as string;

  const termId = `${new Date().getFullYear()}-${termNum}`;
  const SCRAPER_URL = `${TIMETABLE_API}/terms/${termId}/freerooms`;

  const res = await axios.get(SCRAPER_URL);
  const data = (await res.data) as TimetableData;
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

// Gets the week number from the date (based off current term)
export const getWeekAndDay = async (date: Date) => {
  // Get the term start date
  const termStart = await getStartDate();
  const [day, month, year] = termStart.split("/");
  const termStartDate = new Date(+year, +month - 1, +day);

  const diff = date.getTime() - termStartDate.getTime();
  const daysPastStart = diff / (1000 * 60 * 60 * 24);

  // Ceil is used because week numbers start from 1 not 0
  const week = Math.ceil(daysPastStart / 7);

  // Get the day of the week in Australia time
  const dayOfWeek = date.toLocaleDateString('en-GB', {weekday: 'short', timeZone: 'Australia/Sydney'});

  return {week, day: dayOfWeek};
};

// Given a datetime and a list of the room's bookings for 
// the corresponding date, calculate the status of the room
// If room is not free for the given minimum duration, return null
export const calculateStatus = (
  datetime: Date,
  classes: Class[],
  minDuration: number
): RoomStatus | null => {
  const roomStatus: RoomStatus = {
    status: "free",
    endtime: "",
  };

  // Find the first two classes that end after the given time
  let firstAfter: Class | null = null;
  let secondAfter: Class | null = null;
  // Sort classes by end time, then start time.
  classes.sort((a, b) => {
    if (a.start != b.start) {
      return a.start < b.start ? -1 : 1
    } else {
      return a.end < b.end ? -1 : 1 
    }
  })

  for (const cls of classes) {
    const end = new Date(cls.end);
    if (end <= datetime) continue;

    if (!firstAfter || end < new Date(firstAfter.end)) {
      secondAfter = firstAfter;
      firstAfter = cls;
    } else if (!secondAfter || end < new Date(secondAfter.end)) {
      secondAfter = cls;
    }
  }

  if (!firstAfter) {
    // No such class, it is free indefinitely
    // Instead, endtime should be first time unavailable, UNLESS
    // There exists no times today where it is unavailable, and endtime is ""
    return roomStatus;
  }

  const start = new Date(firstAfter.start);
  if (datetime < start) {
    // Class starts after current time i.e. room is free, check if it meets minDuration filter
    const duration = (start.getTime() - datetime.getTime()) / (1000 * 60);
    if (duration < minDuration) {
        return null;
    } else {
        // Add endtime of the free class i.e. the beginning of the firstClass after.
        roomStatus.endtime = firstAfter.start
        return roomStatus;
    }
  } else {
    // Class starts before current time i.e. class occurring now
    if (minDuration > 0) return null;
    roomStatus.status = "busy";

    const end = new Date(firstAfter.end);
    if (end.getTime() - datetime.getTime() <= FIFTEEN_MIN) {
      // Ending soon, check the next class
      if (!secondAfter || new Date(secondAfter.start) > end) {
        // No next class, or it starts after the current class ends
        roomStatus.status = "soon";
        roomStatus.endtime = firstAfter.end;
        return roomStatus;
      }
    } 

    // Loop until you find the first class where there is time free!
    // Then, the previous class endtime must be when the class is free!
    for (let i = 1; i < classes.length; i++) {
        const cls = classes[i];
        const currStart = new Date(cls.start);
        if (currStart.getTime() - datetime.getTime() > 0) {
            roomStatus.endtime = classes[i-1].end;
            return roomStatus;
        }
    }
  }

  return roomStatus;
}
