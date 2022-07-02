import axios from "axios";
import pkg from "jsdom";
import fs from "fs";
import { ScraperData, BuildingDatabase, BuildingData, RoomData } from "./types";
const { JSDOM } = pkg;

/*
 * Definitions
 */
const API = "https://timetable.csesoc.app"

const TERM_DATE_FETCH = `${API}/api/startdate/freerooms`;
const TERM_ID_FETCH = `${API}/api/availableterm`;

const TERM_ID_LENGTH = 2;

const ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"
const BUILDING_URL = `${ENVIRONMENTS_URL}/physical-spaces/teaching-spaces?page=`;
const ROOM_URL = `${ENVIRONMENTS_URL}/find-teaching-space?building_name=&room_name=&page=`;

const LAST_PAGE_REGEX = /<a href=".*page=([0-9]+).*" title="Go to last page">/;
const DATE_REGEX = /(\d{2})\/(\d{2})\/(\d{4})/;
const BUILDING_REGEX = /^[A-Z]-[A-Z][0-9]{1,2}$/;
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

// Scrape building data and store in a JSON file
export const scrapeBuildingData = async (): Promise<BuildingDatabase> => {
  const data: BuildingDatabase = {};

  // Add each building to data
  await getAllBuildings().then((buildings) => {
    buildings.forEach(({ name, id, img }) => {
      data[id] = {
        name: name,
        id: id,
        img: img,
        rooms: {}
      }
    });
  });

  // Add all rooms to their respective buildings
  await getAllRooms().then((rooms) => {
    rooms.forEach(({ name, id }) => {
      const [campus, buildingGrid, roomNumber] = id.split("-");
      const buildingID = `${campus}-${buildingGrid}`;
      if (!(buildingID in data)) {
        throw new Error(`Building not found for Room ID ${id}`);
      }
      data[buildingID].rooms[roomNumber] = {
        name: name,
        id: id
      };
    });
  });

  fs.writeFileSync('database.json', JSON.stringify(data, null, 4));
  return data;
}

// Get all building data by scraping learning environment website
const getAllBuildings = async (): Promise<BuildingData[]> => {
  let first_page = axios.get(BUILDING_URL + 0);
  let last_page_num = getLastPage((await first_page).data);
  const buildingPromises: Promise<any>[] = [first_page];
  for (let i = 1; i <= last_page_num; i++) {
    buildingPromises.push(axios.get(BUILDING_URL + i));
  }

  const buildings: BuildingData[] = [];
  await Promise.all(buildingPromises).then((responses) => {
    responses.forEach((response) => {
      const htmlDoc = new JSDOM(response.data);
      const buildingCards =
        htmlDoc.window.document.getElementsByClassName("type-building");
      for (let i = 0; i < buildingCards.length; i++) {
        const buildingCard = buildingCards[i];

        const name = buildingCard
          .querySelector(".node-title")
          ?.querySelector("a")
          ?.innerHTML;
        const id = buildingCard
          .querySelector(".node-building-id")
          ?.querySelector(".field-item")
          ?.innerHTML;
        const img_url = buildingCard
          .querySelector('img[typeof="foaf:Image"]')
          ?.getAttribute("src");

        if (name && id && BUILDING_REGEX.test(id)) {
          const cleanName = name.replace('&amp;', '&');
          buildings.push({
            name: cleanName,
            id: id,
            img: img_url ? ENVIRONMENTS_URL + img_url : ""
          });
        }
      }
    });
  });
  return buildings;
};

// Gets room codes from a page by parsing the HTML with regex (please excuse my cardinal sin)
const getAllRooms = async (): Promise<RoomData[]> => {
  const first_page = axios.get(ROOM_URL + 0);
  const last_page_num = getLastPage((await first_page).data);
  const roomPromises: Promise<any>[] = [first_page];
  for (let i = 1; i <= last_page_num; i++) {
    roomPromises.push(axios.get(ROOM_URL + i));
  }

  const rooms: RoomData[] = [];
  await Promise.all(roomPromises).then((responses) => {
    responses.forEach((response) => {
      const htmlDoc = new JSDOM(response.data);
      const roomCards =
        htmlDoc.window.document.getElementsByClassName("type-room");
      for (let i = 0; i < roomCards.length; i++) {
        const roomCard = roomCards[i];

        const name = roomCard
          .querySelector(".node-title")
          ?.querySelector("a")
          ?.innerHTML;
        const id = roomCard
          .querySelector(".node-room-id")
          ?.querySelector(".field-item")
          ?.innerHTML;

        if (name && id && ROOM_REGEX.test(id)) {
          const cleanName = name
            .replace(`${id} - `, '')
            .replace('&amp;', '&')
            .replace('  ', ' ');

          rooms.push({
            name: cleanName ? cleanName : id,
            id: id
          });
        }
      }
    });
  });
  return rooms;
};

// Find the number of the last page of a paginated learning environments page
const getLastPage = (page: string): number => {
  const match = LAST_PAGE_REGEX.exec(page);
  return match ? parseInt(match[1]) : 0;
};

// Gets the week number from the date
export const getWeek = async (date: Date) => {
  // In 'DD/MM/YYYY' format
  const termStart = await getStartDate();

  const termStartDate = new Date(termStart);
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
