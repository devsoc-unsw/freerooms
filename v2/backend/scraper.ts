import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
import fs from "fs";
import pkg from "jsdom";
import * as puppeteer from "puppeteer";
const { JSDOM } = pkg;

import { BuildingDatabase, BuildingData, RoomData, RoomUsage, ScrapeResult } from "./types";

/*
 * Definitions
 */
const BATCHSIZE = 10;

const ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"
const BUILDING_URL = `${ENVIRONMENTS_URL}/physical-spaces/teaching-spaces?page=`;
const ROOM_URL = `${ENVIRONMENTS_URL}/find-teaching-space?building_name=&room_name=&page=`;

const PAGE_NUM_REGEX = /page=([0-9]+)/;
const COORD_REGEX = /(-?[0-9]{1,3}\.[0-9]{1,10}),(-?[0-9]{1,3}\.[0-9]{1,10})/;
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
// Global rate limited axios instance
const axiosInstance = axiosRateLimit(axios.create(), { maxRPS: 50 });

// Scrape and return building data
const scrapeBuildingDatabase = async (): Promise<BuildingDatabase> => {
  const data: BuildingDatabase = {};

  // Add each building to data
  await getAllBuildings().then((buildings) => {
    buildings.forEach((building) => {
      data[building.id] = building;
    });
  });

  // Add all rooms to their respective buildings
  await getAllRooms().then((rooms) => {
    rooms.forEach((room) => {
      const [campus, buildingGrid, roomNumber] = room.id.split("-");
      const buildingID = `${campus}-${buildingGrid}`;
      if (!(buildingID in data)) {
        throw new Error(`Building not found for Room ID ${room.id}`);
      }

      data[buildingID].rooms[roomNumber] = room;
    });
  });

  return data;
}

// Get all building data by scraping UNSW learning environments site
const getAllBuildings = async (): Promise<BuildingData[]> => {
  // Scrape each list page 
  const buildingLinkPromises: Promise<string[]>[] = [];
  let last_page_num = await getLastPage(BUILDING_URL);
  for (let i = 0; i <= last_page_num; i++) {
    buildingLinkPromises.push(scrapeBuildingListPage(BUILDING_URL + i));
  }

  // Collate the links from each page
  const buildingLinks: string[] = [];
  await Promise.all(buildingLinkPromises).then((buildingLinkLists) => {
    for (const buildingLinkList of buildingLinkLists) {
      buildingLinks.push(...buildingLinkList);
    }
  });

  // Open each building page with headless browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
  const pages = await createPages(browser, BATCHSIZE);

  const buildings: BuildingData[] = [];
  for (let i = 0; i < buildingLinks.length;) {
    // Process in batches
    const buildingPromises: Promise<ScrapeResult<BuildingData>>[] = [];
    for (let j = 0; j < BATCHSIZE && i < buildingLinks.length; j++, i++) {
      buildingPromises.push(scrapeBuildingPage(pages[j], buildingLinks[i]));
    }

    await Promise.all(buildingPromises).then((scrapedBuildings) => {
      for (const scrapedBuilding of scrapedBuildings) {
        if (scrapedBuilding) {
          buildings.push(scrapedBuilding);
        }
      }
    });
  }

  await browser.close();
  return buildings;
}

// Create browser pages that intercept and abort non-document/script requests
const createPages = async (
  browser: puppeteer.Browser,
  batchsize: number
): Promise<puppeteer.Page[]> => {
  const pages: puppeteer.Page[] = [];
  for (let i = 0; i < batchsize; i++) {
    const page = await browser.newPage();
    // Block all css, fonts and images
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const type = request.resourceType();
      const include = ["document", "script"];
      if (include.includes(type)) {
        request.continue();
      } else {
        request.abort();
      }
    });
    pages.push(page);
  }
  return pages;
};

// Given a building list page, return a list of URLs to building pages
const scrapeBuildingListPage = async (url: string): Promise<string[]> => {
  const response = await axiosInstance.get(url);
  const htmlDoc = new JSDOM(response.data).window.document;
  const buildingCards = htmlDoc.getElementsByClassName("type-building");

  // Get links of each listed building
  const buildingLinks: string[] = [];
  for (let i = 0; i < buildingCards.length; i++) {
    const buildingLink = buildingCards[i]
      .querySelector(".teaser-link")
      ?.querySelector("a")
      ?.getAttribute("href");
    if (buildingLink) {
      buildingLinks.push(ENVIRONMENTS_URL + buildingLink);
    };
  }

  return buildingLinks;
}

// Given a building page URL, scrape the building's data
const scrapeBuildingPage = async (
  page: puppeteer.Page,
  url: string
): Promise<ScrapeResult<BuildingData>> => {
  // Navigate to URL and wait for map to be loaded
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector("[title='Open this area in Google Maps (opens a new window)']");

  // Retrieve all necessary elements
  const { rawName, id, mapUrl, imgUrl } = await page.evaluate(() => {
    const rawName = document
      .querySelector("h1")
      ?.innerHTML;
    const id = document
      .querySelector(".field--name-field-building-id")
      ?.querySelector(".field-item")
      ?.innerHTML;
    const mapUrl = document
      .querySelector("a[title='Open this area in Google Maps (opens a new window)']")
      ?.getAttribute('href');
    const imgUrl = document
      .getElementById('block-page-sidebar')
      ?.querySelector('img[typeof="foaf:Image"]')
      ?.getAttribute("src");

    return { rawName, id, mapUrl, imgUrl };
  });

  // Process elements
  if (!rawName) return;
  const name = rawName.trim().replace('&amp;', '&');

  if (!id || !BUILDING_REGEX.test(id)) return;

  if (!mapUrl) return;
  const coordsMatch = COORD_REGEX.exec(mapUrl); 
  if (!coordsMatch) return;

  return {
    name: name,
    id: id,
    img: imgUrl ? ENVIRONMENTS_URL + imgUrl : "",
    lat: parseFloat(coordsMatch[1]),
    long: parseFloat(coordsMatch[2]),
    rooms: {}
  } as BuildingData;
}

// Get all rooms by scraping UNSW learning environments site
const getAllRooms = async (): Promise<RoomData[]> => {
  // Scrape each list page separately
  const roomPromises: Promise<RoomData[]>[] = [];
  let last_page_num = await getLastPage(ROOM_URL);
  for (let i = 0; i <= last_page_num; i++) {
    roomPromises.push(scrapeRoomListPage(ROOM_URL + i));
  }

  // Collate the result of scraping each page
  const rooms: RoomData[] = [];
  await Promise.all(roomPromises).then((roomLists) => {
    for (const roomList of roomLists) {
      rooms.push(...roomList);
    }
  });
  return rooms;
};

// Given a room list page URL, scrape each listed room
const scrapeRoomListPage = async (url: string): Promise<RoomData[]> => {
  const response = await axiosInstance.get(url);
  const htmlDoc = new JSDOM(response.data).window.document;
  const roomCards = htmlDoc.getElementsByClassName("type-room");

  // Obtain and scrape links for each room
  const roomPromises: Promise<ScrapeResult<RoomData>>[] = [];
  for (let i = 0; i < roomCards.length; i++) {
    const roomLink = roomCards[i]
      .querySelector(".teaser-link")
      ?.querySelector("a")
      ?.getAttribute("href");
    if (!roomLink) continue;
    roomPromises.push(scrapeRoomPage(ENVIRONMENTS_URL + roomLink));
  }

  // Collate scraped rooms
  const rooms: RoomData[] = [];
  await Promise.all(roomPromises).then((scrapedRooms) => {
    for (const scrapedRoom of scrapedRooms) {
      if (scrapedRoom) {
        rooms.push(scrapedRoom);
      }
    }
  });
  return rooms;
}

// Given a room page URL, scrape the room's data
const scrapeRoomPage = async (
  url: string
): Promise<ScrapeResult<RoomData>> => {
  const response = await axiosInstance.get(url);
  const htmlDoc = new JSDOM(response.data).window.document;

  const title = htmlDoc
    .querySelector("h1")
    ?.innerHTML;
  if (!title) return;
  const [id, rawName] = title.trim().split(' - ');
  if (!ROOM_REGEX.test(id)) return;
  const name = rawName.replace('&amp;', '&').replace('  ', ' ');

  const capacity = htmlDoc
    .querySelector(".field--name-field-room-capacity")
    ?.querySelector(".field-item")
    ?.innerHTML;

  const rawUsage = htmlDoc
    .querySelector(".field--name-field-room-usage")
    ?.querySelector(".field-item")
    ?.innerHTML;
  if (!capacity || !rawUsage) return;
  let usage: RoomUsage;
  if (rawUsage.includes('Lecture')) {
    usage = "LEC";
  } else if (rawUsage.includes('Tutorial')) {
    usage = "TUT";
  } else {
    return;
  }

  return {
    id: id,
    name: name,
    capacity: parseInt(capacity),
    usage: usage
  } as RoomData;
}

// Finds the number of the last page of a learning environments page
const getLastPage = async (url: string): Promise<number> => {
  const response = await axiosInstance.get(url + 0);
  const htmlDoc = new JSDOM(response.data).window.document;
  const page_href = htmlDoc
    .querySelector('a[title="Go to last page"]')
    ?.getAttribute("href");
  if (!page_href) return 0;
  const match = PAGE_NUM_REGEX.exec(page_href);
  return match ? parseInt(match[1]) : 0;
};

/*
 * Main
 */
process.on('uncaughtException', (err: any) => {
  if (process.send) {
    process.send({ data: {}, err: err.toString() });
    process.disconnect();
  }
});

console.log('Updating database.json...');
scrapeBuildingDatabase().then((data) => {
  fs.writeFileSync('database.json', JSON.stringify(data, null, 4));
  console.log(`Updated database.json`);
  if (process.send) {
    process.send({ data: data });
    process.disconnect();
  }
});
