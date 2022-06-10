import axios from "axios";
import pkg from "jsdom";
import { ScraperData, BuildingData } from "./types";
const { JSDOM } = pkg;

/*
 * Definitions
 */
const SCRAPER_URL = "https://timetable.csesoc.app/api/terms/2022-T1/freerooms/";
const ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"
const BUILDING_URL = ENVIRONMENTS_URL + "/physical-spaces/teaching-spaces?page=";
const ROOM_URL = ENVIRONMENTS_URL + "/find-teaching-space?building_name=&room_name=&page=";

const BUILDING_PAGES = 2;
const ROOM_PAGES = 13;

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

// Get all building data by scraping learning environment website
export const getBuildingData = async (): Promise<BuildingData[]> => {
  // Request all buildings pages
  let buildingPromises: Promise<any>[] = [];
  let buildings: BuildingData[] = [];
  for (let i = 0; i < BUILDING_PAGES; i++) {
    buildingPromises.push(axios.get(BUILDING_URL + i));
  }
  
  // Resolve all requests
  await Promise.all(buildingPromises).then((responses) => {
    responses.forEach((response) => {
      const htmlDoc = new JSDOM(response.data);
      const buildingCards =
        htmlDoc.window.document.getElementsByClassName("type-building")

      // Get the building name, ID and image from each card
      for (let i = 0; i < buildingCards.length; i++) {
        const buildingCard = buildingCards[i];

        const name =
          buildingCard.querySelector(".node-title")?.querySelector("a")?.innerHTML;
        const id =
          buildingCard.querySelector(".node-building-id")?.querySelector(".field-item")?.innerHTML;
        const img_url =
          buildingCard.querySelector('img[typeof="foaf:Image"]')?.getAttribute("src") || '';
        
        // if name, id succesfully read, add to array
        if (name && id) {
          buildings.push({
            name: name,
            id: id,
            img: img_url ? ENVIRONMENTS_URL + img_url : ""
          } as BuildingData);
        }
      }
    });
  });
  return buildings;
};

// Gets all the room codes for rooms in UNSW by parsing the HTML with regex (please excuse my cardinal sin)
export const getAllRoomIDs = async () => {
  // hello this is a bit slow! is there a way that we could move this to a background process
  // that fetches like every x hours on our server, instead of doing this per request?

  let roomIDs: string[] = [];
  let roomPromises: Promise<any>[] = [];
  for (let i = 0; i < ROOM_PAGES; i++) {
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
