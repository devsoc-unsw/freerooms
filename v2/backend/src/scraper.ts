import axios from "axios";
import * as fs from 'fs';
import axiosRateLimit from "axios-rate-limit";
import { JSDOM } from "jsdom";

import { BuildingData, RoomData } from "./types";
import { DATABASE_PATH } from "./config";

const LEARNING_ENVIRONMENTS_URL = "https://www.learningenvironments.unsw.edu.au"

// Global rate limited axios instance
// Global regular expressions, pre-compile them for faster matching
const axiosInstance = axiosRateLimit(axios.create(), { maxRPS: 50 });
const ROOM_REGEX = new RegExp(/^[A-Z]-[A-Z][0-9]{1,2}-[A-Z]{0,2}[0-9]{1,4}[A-Z]{0,1}$/);


const runScrapingJob = async () => {
  console.log("starting scraping job");
  console.time("scraping time");

  const data = await scrapeAllBuildings();
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 4));

  console.log("ending scraping job");
  console.timeEnd("scraping time");
}

// scrapeAllBuildings scrapes all buildings UNSW has
async function scrapeAllBuildings() {
  const buildingsToScrape = getAllScrapeableBuildings();
  const buildingPromises = [] as Promise<BuildingData>[];

  for await (const buildingName of buildingsToScrape) {
    buildingPromises.push(scrapeBuilding(buildingName));
  }

  return (
    Object.fromEntries(
      (await Promise.all(buildingPromises))
        .map(building => [building.id, building])
    )
  );

}

// scrapeBuilding retrieves all information about a building given its url
const scrapeBuilding = async (buildingName: string): Promise<BuildingData> => {
  const buildingInfoURL = `${LEARNING_ENVIRONMENTS_URL}${buildingName}`;
  const buildingPage = await downloadPage(buildingInfoURL);

  // scrape the details for all the rooms within this building
  const roomsInBuilding = []
  for await (const room of getAllScrapeableRoomsFor(buildingInfoURL, buildingPage)) {
    roomsInBuilding.push(scrapeRoom(room));
  }

  // start scraping the building now
  const scrapedBuildingName = buildingPage?.querySelector("h1")?.innerHTML ?? "";
  const humanizedName = scrapedBuildingName.trim().replace('&amp;', '&');

  const buildingImageUrl = buildingPage?.querySelector('#block-page-sidebar img[typeof="foaf:Image"]')?.getAttribute("src") ?? "";
  const buildingId = buildingPage?.querySelector(".field--name-field-building-id .field-item")?.innerHTML ?? "";

  const googleMapsData = buildingPage?.querySelector("script[data-drupal-selector='drupal-settings-json']")?.innerHTML;
  const { lat, lng } = extractBuildingCoordinates(googleMapsData);

  return {
    name: humanizedName,
    id: buildingId,
    lat: lat,
    long: lng,
    rooms: Object.fromEntries(
      (await Promise.all(roomsInBuilding))
        .map(room => [room.id.split('-')[2], room])
    )
  };
}


// scrapeRoom takes the name of a room and extracts all information about that room
const scrapeRoom = async (roomName: string): Promise<RoomData> => {
  const roomInfoURL = `${LEARNING_ENVIRONMENTS_URL}/${roomName}`;
  const roomPage = await downloadPage(roomInfoURL);

  const { roomId, humanizedName } = parseRoomName(roomPage?.querySelector("h1")?.innerHTML);
  const roomCapacity = roomPage?.querySelector(".field--name-field-room-capacity .field-item")?.innerHTML;
  const usageOptions = parseRoomUsageOptions(roomPage?.querySelector(".field--name-field-room-usage .field-item")?.innerHTML);

  return {
    id: roomId,
    name: humanizedName,
    capacity: parseInt(roomCapacity ?? "-1"),
    usage: usageOptions
  }
}

// parseRoomName takes a room name extracted from a webpage and attempts to decompose it into a name and an ID
const parseRoomName = (rawRoomName: string | undefined | null): { roomId: string, humanizedName: string } => {
  if (!rawRoomName) { throw new Error("expected a room name but found nothing, the page layout has potentially changed"); }

  const [roomId, rawName] = rawRoomName.trim().split(' - ');
  const humanizedName = rawName.replace('&amp;', '&').replace('  ', ' ');

  return ROOM_REGEX.test(roomId)
    ? { roomId, humanizedName }
    : throwErr(`encountered an invalid room ID ${roomId}`);
}

// parseRoomUsageOptions verifies and parses the room usage options listed on a room page
const parseRoomUsageOptions = (usageOptions: string | undefined | null) => {
  switch (true) {
    case usageOptions?.includes("Lecture"): return "LEC";
    case usageOptions?.includes("Tutorial"): return "TUT";
    default:
      throw new Error("could not parse room usage format, document structure may have changed");
  }
}

// extractBuildingCoordinates takes the gmaps script data for a building and extracts the lat and lng of the building
const extractBuildingCoordinates = (gmapsScriptData: string | undefined | null) => {
  if (!gmapsScriptData) { throw new Error("building page does not have a map data"); }

  // I don't know if actually parsing the GMaps configuration and indexing is faster than just doing a regex, probs worth finding out
  const gmapsLocationConfiguration = (Object.values(JSON.parse(gmapsScriptData)["geofield_google_map"]) as any)[0]
                                     ["data"]["features"][0]["geometry"]["coordinates"];

  const [lng, lat] = gmapsLocationConfiguration
  return { lng, lat };
}

// getAllScrapeableEntitiesFromCards returns all entitites that can be scraped from a "card" modal on the UNSW learning spaces site
// see: https://www.learningenvironments.unsw.edu.au/physical-spaces/quadrangle-building?page=0 for an example of these cards
async function* getAllScrapeableEntitiesFromCards(
  cardClass: string,
  basePageUrl: string,
  basePage: Document | undefined = undefined
) {
  let currentPageNumber = 0;

  const isLastPage = (page: Document) => !page.querySelector('a[title="Go to next page"]');
  const getCurrentPageURL = () => `${basePageUrl}?page=${currentPageNumber}`;
  let currentPage = basePage == undefined
    ? await downloadPage(getCurrentPageURL())
    : basePage;

  while (true) {
    const cards = Array.from(currentPage.getElementsByClassName(cardClass));

    for (const card of cards) {
      const entity = card.querySelector(".teaser-link a")?.getAttribute("href");
      if (entity) {
        yield entity;
      }
    }

    // stop scraping if we have reached the last page, otherwise increment the page number and scrape the next page
    // sorry this is a bit messy :(
    if (isLastPage(currentPage)) {
      break;
    }

    currentPageNumber += 1;
    currentPage = await downloadPage(getCurrentPageURL());
  }
}

// getAllScrapeableBuildings is an iterator function that returns all the buildings that we can start a scraping job for
// getAllScrapeableRoomsFor is an iterator function that returns all the rooms within a building that we can start a scraping job for    
// throwErr is a small helper function to just clean up some of the code
const getAllScrapeableBuildings = () => getAllScrapeableEntitiesFromCards("type-building", `${LEARNING_ENVIRONMENTS_URL}/physical-spaces/teaching-spaces`);
const getAllScrapeableRoomsFor = (buildingURL: string, baseBuildingPage: Document) => getAllScrapeableEntitiesFromCards("type-room", buildingURL, baseBuildingPage);
const throwErr = <T>(msg: string): T => { throw Error(msg); }

// downloadPage reads and parses a html page
const downloadCache: Record<string, Document> = {}
const downloadPage = async (url: string): Promise<Document> => {
  if (downloadCache[url] == undefined) {
    const response = await axiosInstance.get(url);
    downloadCache[url] = new JSDOM(response.data).window.document;
  }

  return downloadCache[url];
}


// MAIN
runScrapingJob();
if (process.send) {
  process.send({ err: null });
  process.disconnect();
}
