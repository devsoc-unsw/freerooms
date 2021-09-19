// Initialising application using Express
import express from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const app = express();
const port = 3000;

// Data file (global)
import dataJson from "./data.js";
import buildingDataJson from "./buildings.js";

// Helper functions
import { retrieveRoomStatus } from "./timetableCalculations.js";

// let rooms = await getAllRooms()
const getAllRooms = async () => {
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
    let data = await fetch(ROOM_URL + i).then((response) => response.text());

    const htmlDoc = new JSDOM(data);
    let roomCodes =
      htmlDoc.window.document.getElementsByClassName("field-item");

    let cleanRoomCodes = [];

    for (let j = 0; j < roomCodes.length; j++) {
      let roomCode = roomCodes.item(j).innerHTML;
      if (ROOM_REGEX.test(roomCode)) {
        cleanRoomCodes.push(roomCode);
      }
    }

    rooms += cleanRoomCodes;
  }

  return rooms;
};

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
      } else {
        //If it is a valid date, change d to inteead be the datetime passed in the query
        //Instead of the current one
        d = new Date(req.query.datetime);
      }
    }
    //Create JS object from JSON file
    let buildingObj = dataJson["U1"][buildingID];

    //Pass through to function to get all rooms and their status into required ret
    ret = retrieveRoomStatus(buildingObj, d);

    //Send the response
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


    let ret = {};
    let buildingID = req.params.buildingId;
    let roomID = req.params.roomId;

    //Ensure building ID is valid
    if (!dataJson["U1"].hasOwnProperty(buildingID)) {
      res.send({
        "message": "invalid building ID",
        "status": 400,
      });
    }

    //Ensure room ID is valid
    if (!dataJson["U1"][buildingID].hasOwnProperty(roomID)) {
      res.send({
        "message": "invalid room ID",
        "status": 400,
      });
    }

    //Generate return data straight from the JSON data
    ret = dataJson["U1"][buildingID][roomID];

    res.send(ret);
    console.log("Room availability sent");
  } catch (err) {
    res.send("Room availability data error");
    console.log(Error(err));
  }
});

app.listen(port, () => {
  console.log(`Freerooms backend now listening on port ${port}!`);
});
