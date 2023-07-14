import { load, SelectorType } from 'cheerio';

import { RoomBooking, Room } from "./types";

import axios from "axios";

const LIBRARY_BOOKINGS_URL = "https://unswlibrary-bookings.libcal.com/";


const location = 6581;
const zone = 0;
const category = 0;
const capacity = 0;

const url = `https://unswlibrary-bookings.libcal.com/r/new/availability?lid=${location}&zone=${zone}&gid=${category}&capacity=${capacity}`

const response = axios.get(url);

console.log(response);
