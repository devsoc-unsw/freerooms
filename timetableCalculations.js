import fetch from "node-fetch";
import pkg from "jsdom";
const { JSDOM } = pkg;

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T3/freerooms/";

export const getData = async () => {
  const res = await fetch(SCRAPER_URL);
  return res.json();
};

//Get the current number of the week
//Simple integer division based on the amount of days based since the start of the term
//Note: assumes the inputted term makes sense and does not check if the given date is actually within the given term
export const getWeek = async (day, month, year) => {
  const dataJson = await getData();
  const termStart = dataJson["termStart"];

  const termStartDate = new Date(termStart.split("/").reverse().join("-"));
  const today = new Date(year, month, day);

  const diff = today.getTime() - termStartDate.getTime();

  //Calculate days since start of term
  let daysPastTerm = diff / (1000 * 60 * 60 * 24);

  //Integer division to get term number
  //Ceil is used because week numbers start from 1 not 0
  return Math.ceil(daysPastTerm / 7);
};

export const getAllRooms = async () => {
  const ROOM_URL =
    "https://www.learningenvironments.unsw.edu.au/find-teaching-space?building_name=&room_name=&page=";

  const MAX_PAGES = 13;

  const ROOM_REGEX = /^[A-Z]-[A-Z][0-9]{1,2}-[A-Z]{0,2}[0-9]{1,4}[A-Z]{0,1}$/;
  // One letter - campus ID, e.g. K for Kensington
  // One letter followed by one or two numbers for grid reference e.g. D16 or F8
  // Zero, one or two letters for the floor then between one to four numbers for the room number
  // Library rooms may end in a letter
  // Zero letter floor - 313
  // One letter floor - M18
  // Two letter floor - LG19

  let rooms = [];

  for (let i = 0; i < MAX_PAGES; i++) {
    const response = await fetch(ROOM_URL + i);
    const data = await response.text();

    const htmlDoc = new JSDOM(data);
    const roomCodes =
      htmlDoc.window.document.getElementsByClassName("field-item");

    const cleanRoomCodes = [];

    for (let j = 0; j < roomCodes.length; j++) {
      let roomCode = roomCodes.item(j).innerHTML;
      if (ROOM_REGEX.test(roomCode)) {
        cleanRoomCodes.push(roomCode);
      }
    }

    rooms = rooms.concat(cleanRoomCodes);
  }

  return rooms;
};

export const retrieveRoomStatus = async (
  buildingID,
  roomTimetable,
  currDate
) => {
  let date = currDate.getDate();
  let month = currDate.getMonth();
  let year = currDate.getFullYear();

  const w = await getWeek(date, month, year);
  const week = w.toString();

  //Find current day of week from enumerated array
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = currDate.getDay();
  let dayOfWeek = days[day];

  let result = { rooms: {} };

  const allRooms = await getAllRooms();

  // Initialise result with all empty rooms
  for (let room of allRooms) {
    let [campus, buildingID, roomID] = room.split("-");

    // Check that the room belongs to the provided building
    // If there are no classes scheduled (roomTimetable is null) set the room to be free
    // If there are classes scheduled and that room is not in the schedule, set the room to be free
    if (
      room.startsWith(buildingID + "-") &&
      (!roomTimetable || (roomTimetable && !(roomID in roomTimetable)))
    ) {
      result["rooms"][roomID] = {
        status: "free",
        endtime: "",
      };
    }
  }
  console.log(roomID, result, roomTimetable);

  // No classes scheduled - all rooms are free
  if (!roomTimetable) {
    return result;
  }

  for (let room in roomTimetable) {
    //If there are classes in the current week check through them
    //Otherwise the class is free
    if (week in roomTimetable[room] && dayOfWeek in roomTimetable[room][week]) {
      //If there are classes on the given day of the week check through them
      //Otherwise the class is free

      //Loop through every class in the room on a given day, checking its time period
      for (let lesson in roomTimetable[room][week][dayOfWeek]) {
        //Parsing the start and end date from the JSON

        //Setting the date, month and year to be those of currDate
        //This is incase datetime was specified in which case a different day of the year is required
        let startDateTime = new Date(year, month, date);
        let endDateTime = new Date(year, month, date);

        let timeStart = roomTimetable[room][week][dayOfWeek][lesson]["start"];
        let timeEnd = roomTimetable[room][week][dayOfWeek][lesson]["end"];

        startDateTime.setHours(parseInt(timeStart.split(":")[0]));
        startDateTime.setMinutes(parseInt(timeStart.split(":")[1]));

        endDateTime.setHours(parseInt(timeEnd.split(":")[0]));
        endDateTime.setMinutes(parseInt(timeEnd.split(":")[1]));

        //If the current time is during the time of the class
        //note: a break occurs here to ensure that a soon or busy is definitely given if found
        //otherwise if a class occurs after the given one it would overwrite the soon or busy status
        if (currDate >= startDateTime && currDate <= endDateTime) {
          //Find the difference in minutes
          let diff = endDateTime.getTime() - currDate.getTime();
          let minutesToEnd = diff / (1000 * 60);

          //If within 15 minutes, the class is soon, otherwise busy
          //As per specification
          if (minutesToEnd <= 15) {
            result["rooms"][room] = {
              status: "soon",
              endtime: endDateTime.toISOString(),
            };
            break;
          } else {
            result["rooms"][room] = {
              status: "busy",
              endtime: endDateTime.toISOString(),
            };
            break;
          }
        } else {
          //this will only show up if the current time is not during any of the given class times
          result["rooms"][room] = {
            status: "free",
            endtime: "",
          };
        }
      }
    } else {
      result["rooms"][room] = {
        status: "free",
        endtime: "",
      };
    }
  }

  return result;
};
