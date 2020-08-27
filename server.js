// NODE APP INIT
const express = require("express");
const app = express();
const port = 1337;

const cron = require("node-cron");
const dbName = "freerooms";

/* var MongoClient = require("mongodb").MongoClient; */
var url = "mongodb://localhost:27017";
// MODULES
const scraper = require("./app_modules/scrape.js");

/* MongoClient.connect(url, function (err, db) {
  let courseTypeList = scraper.scrapeCourseTypeList();
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = {};
  dbo.collection("test").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  db.close();
}); */

// INDEX ROUTE (to be updated with dedicated update link or procedure)
app.get("/", async (req, res) => {
  // call scraper with scrapeCourseList function and print
  try {
    let courseTypeList = await scraper.scrapeCourseTypeList();
    let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
    let courseDataList = await scraper.scrapeCourseDataList(courseTypeList)
    res.send(courseDataList);
    console.log("printed message");
  } catch (err) {
    await res.send("unexpected error has occured");
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
