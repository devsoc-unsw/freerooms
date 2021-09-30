import fetch from "node-fetch";

const SCRAPER_URL =
  "https://timetable.csesoc.unsw.edu.au/api/terms/2021-T3/freerooms/";

const getData = async () => {
  return fetch(SCRAPER_URL)
    .then((data) => data.json())
    .then((data) => {
      return data;
    });
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

export const retrieveRoomStatus = async (buildings, currDate) => {
  let date = currDate.getDate();
  let month = currDate.getMonth();
  let year = currDate.getFullYear();

  const w = await getWeek(date, month, year);
  const week = w.toString();

  //Find current day of week from enumerated array
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = currDate.getDay();
  let dayOfWeek = days[day];

  let ret = { rooms: {} };

  for (let room in buildings) {
    //If there are classes in the current week check through them
    //Otherwise the class is free
    if (
      buildings[room].hasOwnProperty(week) &&
      buildings[room][week].hasOwnProperty(dayOfWeek)
    ) {
      //If there are classes on the given day of the week check through them
      //Otherwise the class is free

      //Loop through every class in the room on a given day, checking its time period
      for (let lesson in buildings[room][week][dayOfWeek]) {
        //Parsing the start and end date from the JSON

        //Setting the date, month and year to be those of currDate
        //This is incase datetime was specified in which case a different day of the year is required
        let startDateTime = new Date(year, month, date);
        let endDateTime = new Date(year, month, date);

        let timeStart = buildings[room][week][dayOfWeek][lesson]["start"];
        let timeEnd = buildings[room][week][dayOfWeek][lesson]["end"];

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
            ret["rooms"][room] = {
              status: "soon",
              endtime: endDateTime.toISOString(),
            };
            break;
          } else {
            ret["rooms"][room] = {
              status: "busy",
              endtime: endDateTime.toISOString(),
            };
            break;
          }
        } else {
          //this will only show up if the current time is not during any of the given class times
          ret["rooms"][room] = {
            status: "free",
            endtime: "",
          };
        }
      }
    } else {
      ret["rooms"][room] = {
        status: "free",
        endtime: "",
      };
    }
  }
  return ret;
};
