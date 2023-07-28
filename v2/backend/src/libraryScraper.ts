import { load, SelectorType } from 'cheerio';
import { launch } from 'puppeteer';

import { RoomBooking, Room } from "./types";

import axios from "axios";

const LIBRARY_BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/";

const downloadPage = async() => {
    
    const location = 6581;
    const zone = 0;
    const category = 0;
    const capacity = 0;

    const url = `${LIBRARY_BOOKINGS_URL}r/new/availability?lid=${location}&zone=${zone}&gid=${category}&capacity=${capacity}`

    return axios.get(url);
}

const getRooms = async() => {
    const response = await downloadPage();
    // console.log(response.data);
    const $ = load(response.data);
    console.log($('table'));
}

const scrape = async() => {
    const browser = await launch();
    const page = await browser.newPage();

    const location = 6581;
    const zone = 0;
    const category = 0;
    const capacity = 0;

    const url = `${LIBRARY_BOOKINGS_URL}r/new/availability?lid=${location}&zone=${zone}&gid=${category}&capacity=${capacity}`

    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    const content = await page.content();
    const $ = load(content);
    console.log($('table'))

    await browser.close();
}

// getRooms();
scrape();
