// Initialising application using Express
const express = require("express");
const app = express();
const port = 1337;

// Database integeration
const dbName = "freerooms";
const dbCol = "test";
const fs = require("fs");

// Data file (global)
const dataJsonPath = "./data.json";
var dataJson = require(dataJsonPath);

// MODULES
const scraper = require("./app_modules/scrape.js");
/* const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017"; */

// Connect to database
/* MongoClient.connect(url, function (err, db) {
  // read from disk for now and parse data json
  fs.readFile(dataJson, (err, jsonString) => {
    if (err) throw err;
    console.log("json retrieved");
    try {
      var data = [JSON.parse(jsonString)];
      console.log("data json parsed");
      var dbo = db.db(dbName);
      dbo.collection(dbCol).insertMany(data, function (err, res) {
        if (err) throw err;
        console.log("mongo import done");
        db.close();
      });
    } catch(err) {
      console.log(Error(err));
      db.close();
    }
  });
}); */

// INDEX ROUTE (to be updated with dedicated update link or procedure)
app.get("/", async (req, res) => {
  try {
    res.send("Welcome to the Freerooms backend");

    // This code is for testing - comment out the res.send() above before calling this route
    // let courseTypeList = await scraper.scrapeCourseTypeList();
    // let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
    // let courseDataList = await scraper.scrapeCourseDataList(courseCodeList);
    // res.send(courseDataList);
    // const date = require("./app_modules/date.js");
    // let keyDates = date.scrapeKeyDates();
    // res.send(keyDates);
  } catch (err) {
    console.log(Error(err));
  }
});

// Main route for getting scraper data
app.get("/update", async (req, res) => {
  try {
    res.send("Update route triggered");
    let courseTypeList = await scraper.scrapeCourseTypeList();
    let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
    let courseDataList = await scraper.scrapeCourseDataList(courseCodeList);

    // Update global variable dataJson
    dataJson = courseDataList;
    console.log("Updated data.json");

    // Save data.json to disk for now
    // TODO write to database
    const data = JSON.stringify(courseDataList);
    fs.writeFile(dataJsonPath, data, err => {
      if (err) throw err;
      console.log("Successfully wrote new data to data.json");
    });

    console.log("Update successfully processed");
  } catch (err) {
    console.log(Error(err));
  }
});

// BUILDING DATA ROUTE
// NOTE: UNUSED
/* app.get("/buildings", async (req, res) => {
  try {
    console.log("building data successful");
  } catch (err) {
    await res.send("buildings data error");
    console.log(Error(err));
  }
}); */

// TODO: BUILDING ROOM CODE + STATUS DATA ROUTE
// Route to check status of all rooms in a particular building
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    console.log(`Requested rooms for ${req.params.buildingId}`);
    res.send(`Requested rooms for ${req.params.buildingId}`);
  } catch (err) {
    res.send("Building rooms data error");
    console.log(Error(err));
  }
});

// Route to check availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", async (req, res) => {
  try {
    // TODO TEMPORARY FIX ON CORS HEADER ISSUE
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

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
    res.send([returnObj]);

    console.log("Room availability sent");
  } catch (err) {
    res.send("Room availability data error");
    console.log(Error(err));
  }
});

// TODO: ROOM STATUS FOR WEEK DATA ROUTE
// Route to check availability of a particular room during a particular week
app.get("/buildings/:buildingId/:roomId/:week", async (req, res) => {
  try {
    // TODO TEMPORARY FIX ON CORS HEADER ISSUE
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    console.log(
      `Requested room availability for ${req.params.roomId} in ${req.params.buildingId} during week ${req.params.week}`
    );

    // TODO HARDCODED STUFF WHICH WILL BE AUTOMATED LATER
    const term = "T3";

    let returnList = [];
    const days =
      dataJson[term][req.params.buildingId][req.params.roomId][req.params.week];
    for (let day in days) {
      returnList = returnList.concat(days[day]);
    }

    res.send(returnList);
  } catch (err) {
    res.send("Invalid Room status");
    console.log(Error(err));
  }
});

// TODO: WEEK NUM DATA ROUTE
app.get("/weekNum", async (req, res) => {
  try {
    console.log("weekNum successful");
  } catch (err) {
    await res.send("weekNum data error");
    console.log(Error(err));
  }
});

app.listen(port, () => {
  console.log(`Freerooms backend now listening on port ${port}!`);
});
