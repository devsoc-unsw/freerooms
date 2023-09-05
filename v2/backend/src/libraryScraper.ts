import { load, SelectorType } from 'cheerio';

import { RoomBooking, Room } from "./types";

import axios from "axios";
import fs from "fs";
import { setPriority } from 'os';

const ROOM_URL = "https://unswlibrary-bookings.libcal.com/space/";
const BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/spaces/availability/grid";
const MAIN_LIBRARY_ID = '6581';
const LAW_LIBRARY_ID = '6584';

const scrapeLibraryBookings = async() => {

    const response = await downloadBookingsPage(MAIN_LIBRARY_ID);
    // const responseData = response.data;

    const bookingData = parseBookingData(response.data['slots']);

    const allRoomData: Room[] = [];
    const allRoomBookings: RoomBooking[] = [];

    for (const roomID in bookingData) {
        const roomData = await getRoomData(roomID);
        allRoomData.push(roomData);

        for (const booking of bookingData[roomID]) {
            const roomBooking: RoomBooking = {
                bookingType: 'Study Room',
                name: roomData.name,
                roomId: roomID,
                start: booking.start,
                end: booking.end,
            }
            allRoomBookings.push(roomBooking);
        }
    }

    console.log(allRoomData);
    console.log(allRoomBookings);
}

const downloadBookingsPage = async(locationId: string) => {

    const postData = {
        lid: locationId,
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
                    start: new Date(slot.start),
                    end: new Date(slot.end),
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

const getRoomData = async (roomId: string) => {

    const response = await downloadRoomPage(roomId);
    const $ = load(response.data);

    const $heading = $('h1#s-lc-public-header-title');

    // Remove whitespace and split the name, location and capacity into newlines
    const data = $heading.text().trim().split(/\s{2,}/g);
    const capacity = Number(data[2].split(": ")[1]);

    const roomData: Room = {
        abbr: data[0],
        name: data[0],
        id: roomId,
        usage: "Study Room",
        capacity: capacity,
        school: "Library"
    }

    return roomData;
}

scrapeLibraryBookings();
