import { load, SelectorType } from 'cheerio';

import { RoomBooking, Room } from "./types";

import axios from "axios";
import fs from "fs";

const LIBRARY_BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/";

const POST_URL = "https://unswlibrary-bookings.libcal.com/spaces/availability/grid";

const downloadPage = async() => {

    const postData = {
        lid: '6581',
        gid: '0',
        eid: '-1',
        seat: '0',
        seatId: '0',
        zone: '0',
        start: '2023-09-05',
        end: '2023-09-06',
        pageIndex: '0',
        pageSize: '18'
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded', // because the request data is URL encoded
        'Referer': 'https://unswlibrary-bookings.libcal.com/r/new/availability?lid=6581&zone=0&gid=0&capacity=-1'
    };

    try {
        const response = await axios.post(POST_URL, new URLSearchParams(postData), {headers: headers});
        const responseString = JSON.stringify(response.data, null, 4);
        fs.writeFile('out.txt', responseString, (err) => {
            if (err) throw err;
        })

        return response;
    } catch (error) {
        console.error("Error fetching availability:", error);
    }
}

const scrape = async() => {

    // const browser = await launch();

    const response = await downloadPage();
    // console.log(response.data);
    // const $ = load(response);
    
    // const $ = load(response);
    // console.log($('table.fc-scrollgrid'));


}

// getRooms();
scrape();
