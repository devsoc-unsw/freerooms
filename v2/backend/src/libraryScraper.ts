import { load, SelectorType } from 'cheerio';

import { RoomBooking, Room } from "./types";

const LIBRARY_BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/";

