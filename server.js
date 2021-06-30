// Initialising application using Express
import express from "express";
const app = express();
const port = 1337;

// Data file (global)
import dataJson from "./data.js";

// Route to get all buildings
app.get("/buildings", async (req, res) => {
  try {
    console.log(`Requested all buildings`);
    let ret = '{ "buildings" : [';
    let i = 1;
    for (building in dataJson["U1"]) {
      ret = ret + "{";
      ret = ret + '"name" : "' + buildingDataJson[building]["name"] + '" ,';
      ret = ret + '"id" : "' + buildingDataJson[building]["id"] + '" ,';
      ret = ret + '"img" : "' + buildingDataJson[building]["img"] + '"';
      ret = ret + "}";
      //console.log(Object.keys(dataJson["U1"]).length);
      if (i != Object.keys(dataJson["U1"]).length) {
        ret = ret + ",";
      }

      i++;
    }
    ret = ret + "]}";
    //console.log(ret);
    console.log(JSON.parse(ret));
    res.send(JSON.parse(ret));
  } catch (err) {
    res.send(`Failed to send all buildings`);
    console.log(Error(err));
  }
});

// Route to get status of all rooms in a particular building
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    res.send(`Requested rooms for ${req.params.buildingId}`);
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
