const PROD = process.env.NODE_ENV === "production";

export const SCRAPER_PATH = PROD ? "./dist/scraper.js" : "./src/scraper.ts";
export const DATABASE_PATH = "./database.json";
export const BLDG_LOCATION_PATH = "./buildingLocations.json";
export const PORT = 3000;
