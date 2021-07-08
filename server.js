// Initialising application using Express
import express from "express";
const app = express();
const port = 1337;

// Data file (global)
import dataJson from "./data.js";
import buildingDataJson from "./buildings.js";

// Helper functions
import {retrieveRoomStatus} from './timetableCalculations.js';

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
