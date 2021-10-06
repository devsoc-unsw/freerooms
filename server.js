// Initialising application using Express
import express from "express";

// Helper functions
import {
  getData,
  getAllRooms,
  retrieveRoomStatus,
} from "./timetableCalculations.js";

import buildingData from "./buildings.js";

const app = express();
const port = 3000;

// Route to get all buildings
app.get("/buildings", async (req, res) => {
  try {
    let buildings = { buildings: [] };

    for (let building in buildingData) {
      let iter = {};
      iter["name"] = buildingData[building]["name"];
      iter["id"] = buildingData[building]["id"];
      iter["img"] = buildingData[building]["img"];
      buildings["buildings"].push(iter);
    }

    res.send(buildings);
  } catch (err) {
    res.send(`Failed to send all buildings`);
    console.log(Error(err));
  }
});

// Route to get status of all rooms in a particular building
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    const data = await getData();

    let buildingID = req.params.buildingId;

    if (!(buildingID in buildingData)) {
      res.send({
        message: "invalid building ID",
        status: 400,
      });

      return;
    }

    //Get current date
    let currDate = new Date();

    //Check if datetime query was passed
    if (req.query.datetime) {
      let timestamp = Date.parse(req.query.datetime);

      if (isNaN(timestamp)) {
        res.send({
          message: "invalid date",
          status: 400,
        });

        return;
      } else {
        //If it is a valid date, change currDate to intead be the datetime passed in the query
        currDate = new Date(req.query.datetime);
      }
    }

    //Create JS object from JSON file
    let buildingObj = data[buildingID];

    //Pass through to function to get all rooms and their status into required roomStatus
    let roomStatus = await retrieveRoomStatus(
      buildingID,
      buildingObj,
      currDate
    );
    res.send(roomStatus);
  } catch (err) {
    res.send("Building rooms data error");
    console.log(Error(err));
  }
});

// Route to get availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", async (req, res) => {
  try {
    const data = await getData();
    const allRooms = await getAllRooms();

    let buildingID = req.params.buildingId;
    let roomID = req.params.roomId;

    //Ensure building ID is valid
    if (!(buildingID in buildingData)) {
      res.send({
        message: "invalid building ID",
        status: 400,
      });

      return;
    }

    //Ensure room ID is valid
    if (!data[buildingID] || !(roomID in data[buildingID])) {
      if (allRooms.includes(buildingID + "-" + roomID)) {
        return [];
      } else {
        res.send({
          message: "invalid room ID",
          status: 400,
        });

        return;
      }
    }

    //Generate return data straight from the JSON data
    let availabilities = data[buildingID][roomID];
    res.send(availabilities);
  } catch (err) {
    res.send("Room availability data error");
    console.log(Error(err));
  }
});

app.listen(port, () => {
  console.log(`Freerooms backend now listening on port ${port}!`);
});
