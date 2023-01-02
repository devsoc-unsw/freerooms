const PROD = process.env.NODE_ENV === "production";

export const SCRAPER_PATH = PROD ? "./dist/scraper.js" : "./src/scraper.ts";
export const DATABASE_PATH = PROD ? "./database.json" : "./database.json";
