import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
import fs from "fs";
import pkg from "jsdom";
const { JSDOM } = pkg;

import { BuildingDatabase, BuildingData, RoomData, RoomUsage } from "./types";

/*
 * Definitions
 */
const ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"
const BUILDING_URL = `${ENVIRONMENTS_URL}/physical-spaces/teaching-spaces?page=`;
const ROOM_URL = `${ENVIRONMENTS_URL}/find-teaching-space?building_name=&room_name=&page=`;

const LAST_PAGE_REGEX = /<a href=".*page=([0-9]+).*" title="Go to last page">/;
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

// Scrape building data and store in a JSON file
const scrapeBuildingData = async (): Promise<BuildingDatabase> => {
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
    rooms.forEach(({ name, id, capacity, usage }) => {
      const [campus, buildingGrid, roomNumber] = id.split("-");
      const buildingID = `${campus}-${buildingGrid}`;
      if (!(buildingID in data)) {
        throw new Error(`Building not found for Room ID ${id}`);
      }

      data[buildingID].rooms[roomNumber] = {
        name: name,
        id: id,
        capacity: capacity,
        usage: usage
      };
    });
  });

  return data;
}

// Get all building data by scraping UNSW learning environments site
const getAllBuildings = async (): Promise<BuildingData[]> => {
  // Scrape each page separately
  const buildingPromises: Promise<BuildingData[]>[] = [];
  let last_page_num = await getLastPage(BUILDING_URL);
  for (let i = 0; i <= last_page_num; i++) {
    buildingPromises.push(scrapeBuildingListPage(BUILDING_URL + i));
  }

  // Collate the result of scraping each page
  const buildings: BuildingData[] = [];
  await Promise.all(buildingPromises).then((buildingLists) => {
    for (const buildingList of buildingLists) {
      buildings.push(...buildingList);
    }
  });
  return buildings;
}

// Given a building list page URL, scrape each listed building
const scrapeBuildingListPage = async (url: string) => {
  const response = await axiosInstance.get(url);
  const htmlDoc = new JSDOM(response.data);
  const buildingCards =
    htmlDoc.window.document.getElementsByClassName("type-building");

  const buildings: BuildingData[] = [];
  for (let i = 0; i < buildingCards.length; i++) {
    const buildingCard = buildingCards[i];

    const rawName = buildingCard
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
    if (!rawName || !id || !BUILDING_REGEX.test(id)) continue;

    const name = rawName.replace('&amp;', '&');
    buildings.push({
      name: name,
      id: id,
      img: img_url ? ENVIRONMENTS_URL + img_url : ""
    });
  }
  return buildings;
}

// Get all rooms by scraping UNSW learning environments site
const getAllRooms = async (): Promise<RoomData[]> => {
  // Scrape each page separately
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
const scrapeRoomListPage = async (url: string) => {
  const response = await axiosInstance.get(url);
  const htmlDoc = new JSDOM(response.data);
  const roomCards =
    htmlDoc.window.document.getElementsByClassName("type-room");

  // Obtain and scrape links for each room
  const roomPromises: Promise<RoomData | undefined>[] = [];
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
const scrapeRoomPage = async (url: string) => {  
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
const getLastPage = async (url: string) => {
  const response = await axiosInstance.get(url + 0);
  const page = response.data;
  const match = LAST_PAGE_REGEX.exec(page);
  return match ? parseInt(match[1]) : 0;
};

/*
 * Main
 */
process.on('uncaughtException', (err: any) => {
  if (process.send) {
    process.send({ data: {}, err: err.toString() });
  }
  process.disconnect();
});

console.log('Updating database.json...');
scrapeBuildingData().then((data) => {
  fs.writeFileSync('database.json', JSON.stringify(data, null, 4));
  console.log(`Updated database.json`);
  if (process.send) {
    process.send({ data: data });
  }
  process.disconnect();
});
