const DEV = process.env.NODE_ENV !== "production";

export const SCRAPER_PATH = DEV ? "./src/scraper.ts" : "./dist/scraper.js";
export const DATABASE_PATH = DEV ? "./database.json" : "./app/database.json";
