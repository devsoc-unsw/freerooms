import { load, SelectorType } from 'cheerio';

import { RoomBooking, Room } from "./types";

import axios from "axios";
import fs from "fs";

const ROOM_URL = "https://unswlibrary-bookings.libcal.com/space/";

const POST_URL = "https://unswlibrary-bookings.libcal.com/spaces/availability/grid";

const downloadBookingsPage = async() => {

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

    const response = await axios.post(POST_URL, new URLSearchParams(postData), {headers: headers});
    // const responseString = JSON.stringify(response.data, null, 4);
    // fs.writeFile('out.txt', responseString, (err) => {
    //     if (err) throw err;
    // })

    return response;
}

interface ResponseData {
    start: string,
    end: string,
    itemID: string,
    checksum: string,
    className: string | null
}

const parseBookingData = (bookingData: ResponseData[]) => {
    // console.log(bookingData);

    let bookings: { [key: string]: any[] } = {};

    for (const slot of bookingData) {
        if (!(slot.itemID in bookings)) {
            bookings[slot.itemID] = [];
        }

        if (slot.className != null) {
            bookings[slot.itemID].push(
                {
                    start: new Date(slot.start),
                    end: new Date(slot.end),
                }
            )
        }

    }

    return bookings;
}

const scrapeLibraryBookings = async() => {

    // const browser = await launch();

    const response = await downloadBookingsPage();
    // const responseData = response.data;

    const bookingData = parseBookingData(response.data['slots']);

    const allRoomData: Room[] = [];
    const allRoomBookings: RoomBooking[] = [];

    for (const roomID in bookingData) {
        // roomBookingData
        const roomData = getRoomData(roomID);
        allRoomData.push(roomData);

        for (const booking of bookingData[roomID]) {
            const roomBooking: RoomBooking = {
                bookingType: '?',
                name: roomData.name,
                roomId: roomID,
                start: booking.start,
                end: booking.end,
            }
            allRoomBookings.push(roomBooking);
        }
    }
}

const downloadRoomPage = async(roomId: string) => {
    try {
        const response = await axios.get(ROOM_URL + roomId, {});
        // const responseString = JSON.stringify(response.data, null, 4);

        fs.writeFile('out.txt', response.data, (err) => {
            if (err) throw err;
        });

        return response;

    } catch (error) {
        console.error("Error fetching availability:", error);
    }
}


const scrape = async() => {

    // const browser = await launch();

    // const response = await downloadPage();

    const response2 = await downloadRoomPage("45757");
    // console.log(response.data);
    // const $ = load(response);

    // const $ = load(response);
    // console.log($('table.fc-scrollgrid'));


}

// getRooms();
scrapeLibraryBookings();
