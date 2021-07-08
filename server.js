// Initialising application using Express
import express from "express";
const app = express();
const port = 1337;

// Data file (global)
import dataJson from "./data.js";
import buildingDataJson from "./buildings.js";

// Route to get all buildings
app.get("/buildings", async (req, res) => {
  try {
    console.log(`Requested all buildings`);
    let ret = {"buildings" : []};
    for (let building in dataJson["U1"]) {
      let iter = {};
      iter["name"] = buildingDataJson[building]["name"];
      iter["id"] = buildingDataJson[building]["id"];
      iter["img"] = buildingDataJson[building]["img"];
      ret["buildings"].push(iter);
    }
    console.log(ret);
    res.send(ret);
  } catch (err) {
    res.send(`Failed to send all buildings`);
    console.log(Error(err));
  }
});
//Gets the current term 
//This is unused right now but will need to be used when the scraper is working

function getTerm(day, month, year) {
  //This needs to be redone with some scraper to get the start and end dates for a given year
  const dateCurrent = new Date();
  dateCurrent.setFullYear(year, month, day);

  //These needs to changed based on the given year and scraped from the UNSW server
  //Or updated manually I dont really know
  const t1Start = new Date("2021-02-15");
  const t1End = new Date("2021-05-13");

  const t2Start = new Date("2021-05-31");
  const t2End = new Date("2021-08-26");

  const t3Start = new Date("2021-09-13");
  const t3End = new Date("2021-12-09");

  if (dateCurrent >= t1Start && dateCurrent <= t1End) {
    return 1;
  }
  if (dateCurrent >= t2Start && dateCurrent <= t2End) {
    return 2;
  }
  if (dateCurrent >= t3Start && dateCurrent <= t3End) {
    return 3;
  }
  return -1;
}
//Get the current number of the week
//Simple integer division based on the amount of days based since the start of the term
//Note: assumes the inputted term makes sense and does not check if the given date is actually within the given term
function getWeek(term, day, month, year) {
  //These need to be found a better way instead of hard coded
  const t1Start = new Date("2021-02-15");

  const t2Start = new Date("2021-05-31");

  const t3Start = new Date("2021-09-13");
  
  const dateCurrent = new Date();
  dateCurrent.setFullYear(year, month, day);
  let diff;
  switch (term) {
    case (1):
      diff = dateCurrent.getTime() - t1Start.getTime();
      break;
    case (2):
      diff = dateCurrent.getTime() - t2Start.getTime();
      break;
    case (3):
      diff = dateCurrent.getTime() - t3Start.getTime();
      break;
  }
  //Calculate days since start of term
  let daysPastTerm = diff / (1000*60*60*24);

  //Integer division to get term number
  //Ceil is used because week numbers start from 1 not 0
  let weekNumber = Math.ceil(daysPastTerm / 7);
  
  return weekNumber;

}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
// Route to get status of all rooms in a particular building
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    //res.send(`Requested rooms for ${req.params.buildingId}`);
    let buildingID = req.params.buildingId;

    //Error checking for validity of building ID
    if (!dataJson["U1"].hasOwnProperty(buildingID)) {
      res.send({
        "message": "invalid building ID",
        "status": 400,
      });
    }
    let ret = {"rooms": {}};

    //Get current date
    let d = new Date();

    //Check if datetime query was passed
    //If it is do the following
    if (req.query.datetime) {
      //Error checking to see if the datetime is valid or not
      let timestamp = Date.parse(req.query.datetime);
      if(isNaN(timestamp)) {
        res.send({
          "message": "invalid date",
          "status": 400,
        });
        console.log("herrr???");
      } else {
        //If it is a valid date, change d to inteead be the datetime passed in the query
        //Instead of the current one
        d = new Date(req.query.datetime);
      }
    }
    let date = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    console.log("The date is" + date + "/" + month + "/" + year);
    //Find current term and week based on above algorithms
    const t = getTerm(date, month, year);

    //This will break if a date not in a given school term is supplied
    if (t === -1) {
      res.send({
        "message": "invalid date",
        "status": 400,
      });
    }
    const w = getWeek(t, date, month, year);

    //Find current day of week from enumerated array
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = d.getDay();
    let dayOfWeek = days[day];

    console.log("It is week: " + w + " and the day is " + dayOfWeek + " and the hour is " + d.getHours() + "and the minutes are " + d.getMinutes());
    
    //Access json file, note HardCoded term U1 needs to be altered for the found term with above function
    let buildingObj = dataJson["U1"][buildingID];
    //Loop through each room in the chosen building
    for (let room in buildingObj) {
      //If there are classes in the current week check through them
      //Otherwise the class is free
      if (buildingObj[room].hasOwnProperty(w.toString())) {
        //If there are classes on the given day of the week check through them
        //Otherwise the class is free
        if (buildingObj[room][w.toString()].hasOwnProperty(dayOfWeek)) {
          //Loop through every class in the room on a given day, checking its time period
          for (let lesson in buildingObj[room][w.toString()][dayOfWeek]) {
            //Parsing the start and end date from the JSON
            let startDateTime = new Date();
            let endDateTime = new Date();

            //Setting the date, month and year to be those of d
            //This is incase datetime was specified in which case a different day of the year
            //Is required
            startDateTime.setDate(date);
            startDateTime.setMonth(month);
            startDateTime.setFullYear(year);

            endDateTime.setDate(date);
            endDateTime.setMonth(month);
            endDateTime.setFullYear(year);

            let timeStart = buildingObj[room][w.toString()][dayOfWeek][lesson]["start"].split(" ")[1];
            let timeEnd = buildingObj[room][w.toString()][dayOfWeek][lesson]["end"].split(" ")[1];

            startDateTime.setHours(parseInt(timeStart.split(":")[0]));
            startDateTime.setMinutes(parseInt(timeStart.split(":")[1]));

            endDateTime.setHours(parseInt(timeEnd.split(":")[0]));
            endDateTime.setMinutes(parseInt(timeEnd.split(":")[1]));

            //If the current time is during the time of the class
            //note: a break occurs here to ensure that a soon or busy is definitely given if found
            //otherwise if a class occurs after the given one it would overwrite the soon or busy status
            if (d >= startDateTime && d <= endDateTime) {
              //Find the difference in minutes
              let diff = endDateTime.getTime() - d.getTime();
              let minutesToEnd = diff / (1000*60);

              //If within 15 minutes, the class is soon, otherwise busy
              //As per specification
              if (minutesToEnd <= 15) {
                ret["rooms"][room] = "soon";
                break;
              } else {
                ret["rooms"][room] = "busy";
                break;
              }
            } else {
              //this will only show up if the current time is not during any of the given class times
              ret["rooms"][room] = "free";
            }
            //Debugging Statement
            console.log("This class goes from " + timeStart + " to " + timeEnd);
          }
          
        } else {
          ret["rooms"][room] = "free";
        }
      } else {
        ret["rooms"][room] = "free";
      }
    }
  //Send the output JSON
  res.send(ret);
  } catch (err) {
    res.send("Building rooms data error");
    console.log(Error(err));
  }
});

// Route to get availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", async (req, res) => {
  try {
    console.log(
      `Requested room availability for ${req.params.roomId} in ${req.params.buildingId}`
    );

    // TODO HARDCODED STUFF WHICH WILL BE AUTOMATED LATER
    const term = "T3";
    const week = 1;
    const day = "Thu";

    let returnObj = {};
    const roomname =
      dataJson[term][req.params.buildingId][req.params.roomId].name;
    const classes =
      dataJson[term][req.params.buildingId][req.params.roomId][week][day];
    returnObj[roomname] = classes;
    res.send(returnObj);

    console.log("Room availability sent");
  } catch (err) {
    res.send("Room availability data error");
    console.log(Error(err));
  }
});

app.listen(port, () => {
  console.log(`Freerooms backend now listening on port ${port}!`);
});
