import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

import classrooms from "../classrooms.json";

const OUTPUT_PATH = path.join(
  __dirname,
  "../../../frontend/public/room-photos.json"
);

const CAMPUS_CODE = 0;
const BUILDING_CODE = 1;

async function scrapeRoom(): Promise<string | null> {
  const roomIds = classrooms.map((c) => c.id);
  const results: Record<string, string[]> = {};

  for (const r of roomIds) {
    console.log(`Trying for ${r}`);
    try {
      const s = r.split("-");

      const building = (s[CAMPUS_CODE] + "-" + s[BUILDING_CODE]).toLowerCase();
      const room = r.toLowerCase();

      const ROOM_URL = `https://www.learningenvironments.unsw.edu.au/physical-spaces/${building}/${room}`;

      const { data } = await axios.get(ROOM_URL);
      const $ = cheerio.load(data);

      const images = $("div.field--name-field-media-image a")
        .map((i, el) => $(el).attr("href"))
        .get();
      console.log(images);
      results[r] = images;
    } catch (error) {
      console.error(error);
      results[r] = [];
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  return null;
}

scrapeRoom();
