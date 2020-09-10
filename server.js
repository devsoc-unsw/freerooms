// NODE APP INIT
const express = require("express");
const app = express();
const port = 1337;

const cron = require("node-cron");
const dbName = "freerooms";
const dbCol = "test";
const fs = require('fs');

/* const MongoClient = require("mongodb").MongoClient; */
const url = "mongodb://localhost:27017";

const dataJson = `./data.json`;
// MODULES
const scraper = require("./app_modules/scrape.js");

/* MongoClient.connect(url, function (err, db) {
  // read from disk for now and parse data json
  fs.readFile(dataJson, (err, jsonString) => {
    if (err) throw err;
    console.log("json retrieved");
    try {
      var data = JSON.parse(jsonString);
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
    res.send("Triggered");
    console.log("printed message");
    let courseTypeList = await scraper.scrapeCourseTypeList();
    let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
    let courseDataList = await scraper.scrapeCourseDataList(courseCodeList);
    
    // save to disk for now
    const data = JSON.stringify(courseDataList);
    fs.writeFile(dataJson, data, (err) => {
      if (err) throw err;
      console.log("saved");
    });

    console.log("processed");
  } catch (err) {
    console.log(Error(err));
  }
});

// BUILDING DATA ROUTE
app.get("/buildings", async (req, res) => {
  try {
    console.log("building data successful");
  } catch (err) {
    await res.send("buildings data error");
    console.log(Error(err));
  }
});

// BUILDING ROOM CODE + STATUS DATA ROUTE
app.get("/buildings/:buildingId", async (req, res) => {
  try {
    console.log("building rooms + status successful");
  } catch (err) {
    await res.send("building rooms data error");
    console.log(Error(err));
  }
});

// BUILDING ROOM STATUS DATA ROUTE
app.get("/buildings/:buildingId/:roomId", async (req, res) => {
  try {
    console.log("room status successful");
  } catch (err) {
    await res.send("building room status data error");
    console.log(Error(err));
  }
});

// ROOM STATUS FOR WEEK DATA ROUTE
app.get("/buildings/:buildingId/:roomID/:week", async (req, res) => {
  try {
    console.log("room status for week successful");
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
