// Initialising application using Express
import express from "express";
const app = express();
const port = 1337;

// Data file (global)
const dataJsonPath = "./data.json";
var dataJson = require(dataJsonPath);

// Route to get all buildings
app.get("/buildings", async (req, res) => {
  try {
    res.send("Requested all buildings");
  } catch (err) {
    res.send("Buildings data error");
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
