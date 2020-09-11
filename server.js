// NODE APP INIT
const express = require("express");
const app = express();
const port = 1337;

const cron = require("node-cron");
const dbName = "freerooms";
const dbCol = "test";
const fs = require('fs');

/* const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017"; */
var dataJsonPath = './data.json';
var dataJson = require(dataJsonPath);

// MODULES
const scraper = require("./app_modules/scrape.js");

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
  // call scraper with scrapeCourseList function and print
  try {
    res.send("Welcome to the freerooms backend");
    console.log("processed");
  } catch (err) {
    console.log(Error(err));
  }
});

// INDEX ROUTE (to be updated with dedicated update link or procedure)
app.get("/update", async (req, res) => {
  // call scraper with scrapeCourseList function and print
  try {
    res.send("Triggered");
    let courseTypeList = await scraper.scrapeCourseTypeList();
    let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
    let courseDataList = await scraper.scrapeCourseDataList(courseCodeList);

    // update global
    dataJson = courseDataList;
    console.log("updated");

    // save to disk for now
    const data = JSON.stringify(courseDataList);
    fs.writeFile(dataJsonPath, data, (err) => {
      if (err) throw err;
      console.log("saved");
    });

    console.log("processed");
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

// BUILDING ROOM CODE + STATUS DATA ROUTE
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    console.log(`requested rooms for ${req.params.buildingId}`);
    res.send(dataJson.T3[req.params.buildingId][1].Thu);
  } catch (err) {
    await res.send("building rooms data error");
    console.log(Error(err));
  }
});

// BUILDING ROOM STATUS DATA ROUTE
app.get("/buildings/:buildingId/:roomId", async (req, res) => {
  try {
    console.log(`requested room status for ${req.params.roomId} in ${req.params.buildingId}`);
    res.send(`requested room status for ${req.params.roomId} in ${req.params.buildingId}`);
  } catch (err) {
    await res.send("building room status data error");
    console.log(Error(err));
  }
});

// ROOM STATUS FOR WEEK DATA ROUTE
app.get("/buildings/:buildingId/:roomId/:week", async (req, res) => {
  try {
    console.log(`requested rooms for ${req.params.roomId} in ${req.params.buildingId} during week ${req.params.week}`);
    res.send(`requested rooms for ${req.params.roomId} in ${req.params.buildingId} during week ${req.params.week}`);
  } catch (err) {
    await res.send("Invalid Room status");
    console.log(Error(err));
  }
});

// WEEK NUM DATA ROUTE
app.get("/weekNum", async (req, res) => {
  try {
    console.log("weekNum successful");
  } catch (err) {
    await res.send("weekNum data error");
    console.log(Error(err));
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
