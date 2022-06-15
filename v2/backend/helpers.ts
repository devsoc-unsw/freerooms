import axios from "axios";
import pkg from "jsdom";
import fs from "fs";
import { ScraperData, BuildingDatabase, BuildingData } from "./types";
const { JSDOM } = pkg;

/*
 * Definitions
 */
const SCRAPER_URL = "https://timetable.csesoc.app/api/terms/2022-T1/freerooms/";
const ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"
const BUILDING_URL = ENVIRONMENTS_URL + "/physical-spaces/teaching-spaces?page=";
const ROOM_URL = ENVIRONMENTS_URL + "/find-teaching-space?building_name=&room_name=&page=";

const LAST_PAGE_REGEX = /<a href=".*page=([0-9]+).*" title="Go to last page">/;

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

export const getScraperData = async (): Promise<ScraperData> => {
  const res = await axios.get(SCRAPER_URL);
  const data = (await res.data) as ScraperData;
  return data;
};

export const getBuildingData = async(): Promise<BuildingDatabase> => {
  // If database.json over a month old, re scrape
  const stat = fs.statSync('database.json');
  const modTime = stat.mtime;
  const timeNow = new Date();
  if (
    timeNow.getFullYear() - modTime.getFullYear() > 0 ||
    timeNow.getMonth() - modTime.getMonth() > 0
  ) {
    await scrapeBuildingData();
  }

  const rawData = fs.readFileSync('database.json', 'utf8');
  const data = JSON.parse(rawData) as BuildingDatabase;
  return data;
}

// Find the number of the last page of a paginated learning environments page
const getLastPage = (page: string): number => {
  const match = LAST_PAGE_REGEX.exec(page);
  return match ? parseInt(match[1]) : 0;
};

// Scrape building data and store in a JSON file
const scrapeBuildingData = async() => {
  let data: BuildingDatabase = {};

  // Get all buildings
  let first_page = axios.get(BUILDING_URL + 0);
  let last_page_num = getLastPage((await first_page).data);
  const buildingPromises: Promise<any>[] = [first_page];
  for (let i = 1; i <= last_page_num; i++) {
    buildingPromises.push(axios.get(BUILDING_URL + i));
  }
  await Promise.all(buildingPromises).then((responses) => {
    responses.forEach((response) => {
      scrapeBuildings(response).forEach((building) => {
        data[building.id] = {
          ...building,
          rooms: []
        };
      });
    });
  });

  // Add all rooms to their respective buildings
  first_page = axios.get(ROOM_URL + 0);
  last_page_num = getLastPage((await first_page).data);
  const roomPromises: Promise<any>[] = [first_page];
  for (let i = 1; i <= last_page_num; i++) {
    roomPromises.push(axios.get(ROOM_URL + i));
  }
  await Promise.all(roomPromises).then((responses) => {
    responses.forEach((response) => {
      scrapeRoomIDs(response).forEach((roomID) => {
        const [campus, buildingGrid, roomNumber] = roomID.split("-");
        const buildingID = `${campus}-${buildingGrid}`;
        if (!(buildingID in data)) {
          throw new Error(`Building not found for Room ID ${roomID}`);
        }
        data[buildingID].rooms.push(roomNumber);
      });
    });
  });

  fs.writeFileSync('database.json', JSON.stringify(data, null, 4));
}

// Get all building data by scraping learning environment website
const scrapeBuildings = (response: any): BuildingData[] => {
  const buildings: BuildingData[] = [];
  const htmlDoc = new JSDOM(response.data);
  const buildingCards =
    htmlDoc.window.document.getElementsByClassName("type-building")
  for (let i = 0; i < buildingCards.length; i++) {
    const buildingCard = buildingCards[i];

    // Get the building name, ID and image URL from each card
    const name =
      buildingCard.querySelector(".node-title")?.querySelector("a")?.innerHTML;
    const id =
      buildingCard.querySelector(".node-building-id")?.querySelector(".field-item")?.innerHTML;
    const img_url =
      buildingCard.querySelector('img[typeof="foaf:Image"]')?.getAttribute("src") || '';

    if (name && id) {
      const cleanName = name.replace('&amp;', '&');
      buildings.push({
        name: cleanName,
        id: id,
        img: img_url ? ENVIRONMENTS_URL + img_url : ""
      });
    }
  }
  return buildings;
};

// Gets room codes from a page by parsing the HTML with regex (please excuse my cardinal sin)
const scrapeRoomIDs = (response: any): string[] => {
  const roomIDs: string[] = [];
  const htmlDoc = new JSDOM(response.data);
  const rawRoomIDs =
    htmlDoc.window.document.getElementsByClassName("field-item");
  if (!rawRoomIDs) return roomIDs;
  for (let j = 0; j < rawRoomIDs.length; j++) {
    let roomID = rawRoomIDs.item(j)?.innerHTML;
    if (roomID && ROOM_REGEX.test(roomID)) {
      roomIDs.push(roomID);
    }
  }
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
