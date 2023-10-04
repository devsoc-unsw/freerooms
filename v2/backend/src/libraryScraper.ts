import { load } from 'cheerio';

import { RoomBooking, Room } from "./types";

import toSydneyTime from "./toSydneyTime";

import axios from "axios";

const ROOM_URL = "https://unswlibrary-bookings.libcal.com/space/";
const BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/spaces/availability/grid";
const MAIN_LIBRARY_CODE = '6581';
const MAIN_LIBRARY_ID = 'K-F21';
const LAW_LIBRARY_CODE = '6584';
const LAW_LIBRARY_ID = 'K-E8';

const scrapeLibraryBookings = async(library_code: string, library_id: string) => {

    const response = await downloadBookingsPage(library_code);

    const bookingData = parseBookingData(response.data['slots']);

    const allRoomData: Room[] = [];
    const allRoomBookings: RoomBooking[] = [];

    for (const roomID in bookingData) {
        const roomData = await getRoomData(roomID, library_id);
        allRoomData.push(roomData);

        for (const booking of bookingData[roomID]) {
            const roomBooking: RoomBooking = {
                bookingType: 'LIBRARY',
                name: roomData.name,
                roomId: roomID,
                start: booking.start,
                end: booking.end,
            }
            allRoomBookings.push(roomBooking);
        }
    }

    // console.log(allRoomData);
    // console.log(JSON.stringify(allRoomBookings, null, 4));

}

// Formats a date into YYYY-MM-DD format
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

const downloadBookingsPage = async(locationId: string) => {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // First date of the year
    const firstDate = formatDate(new Date(currentYear, 0, 1));  // Month is 0-indexed, so 0 = January

    // Last date of the year
    const lastDate = formatDate(new Date(currentYear, 11, 31));  // Month 11 = December

    const postData = {
        lid: locationId,
        gid: '0',
        eid: '-1',
        seat: '0',
        seatId: '0',
        zone: '0',
        start: firstDate,
        end: lastDate,
        pageIndex: '0',
        pageSize: '18'
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded', // because the request data is URL encoded
        'Referer': 'https://unswlibrary-bookings.libcal.com/r/new/availability?lid=6581&zone=0&gid=0&capacity=-1'
    };

    const response = await axios.post(BOOKINGS_URL, new URLSearchParams(postData), {headers: headers});

    return response;
}

interface ResponseData {
    start: string,
    end: string,
    itemId: number,
    checksum: string,
    className: string | null
}

const parseBookingData = (bookingData: ResponseData[]) => {

    let bookings: { [key: number]: any[] } = {};

    for (const slot of bookingData) {
        if (!(slot.itemId in bookings)) {
            bookings[slot.itemId] = [];
        }

        if (slot.className == "s-lc-eq-checkout") {
            bookings[slot.itemId].push(
                {
                    start: toSydneyTime(new Date(slot.start)),
                    end: toSydneyTime(new Date(slot.end)),
                }
            )
        }
    }

    return bookings;
}

const downloadRoomPage = async(roomId: string) => {

    const response = await axios.get(ROOM_URL + roomId, {});

    return response;

}

const getRoomData = async (roomId: string, buildingId: string) => {

    const response = await downloadRoomPage(roomId);
    const $ = load(response.data);

    const $heading = $('h1#s-lc-public-header-title');

    // Remove whitespace and split the name, location and capacity into newlines
    const data = $heading.text().trim().split(/\s{2,}/g);
    const capacity = Number(data[2].split(": ")[1]);

    const roomData: Room = {
        abbr: data[0],
        name: data[0],
        id: buildingId + "-" + roomId,
        usage: "LIBRARY",
        capacity: capacity,
        school: " "
    }

    return roomData;
}

scrapeLibraryBookings(MAIN_LIBRARY_CODE, MAIN_LIBRARY_ID);
scrapeLibraryBookings(LAW_LIBRARY_CODE, LAW_LIBRARY_ID);
