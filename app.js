// NODE APP INIT
const express = require('express');
const app = express();
const port = 1337;

// MODULES
const scraper = require('./app_modules/scrape.js');

// INDEX ROUTE (to be updated with dedicated update link or procedure)
app.get('/', async (req, res) => {
	// call scraper with scrapeCourseList function and print
	try {
		let courseTypeList = await scraper.scrapeCourseTypeList();
		let courseCodeList = await scraper.scrapeCourseCodeList(courseTypeList);
		res.send(courseCodeList);
		console.log('printed message');
	}
	catch (err) {
		await res.send('unexpected error has occured');
		console.log(Error(err));
	}
});

// BUILDING DATA ROUTE
app.get('/buildings', async(req, res) => {
	try {
		console.log('building data successful');
	}
	catch (err) {
		await res.send('buildings data error');
		console.log(Error(err));
	}
});

// BUILDING ROOM CODE + STATUS DATA ROUTE
app.get('/buildings/:buildingId', async(req, res) => {
	try {
		console.log('building rooms + status successful');
	}
	catch (err) {
		await res.send('building rooms data error');
		console.log(Error(err));
	}
});

// BUILDING ROOM STATUS DATA ROUTE
app.get('/buildings/:buildingId/:roomId', async(req, res) => {
	try {
		console.log('room status successful');
	}
	catch (err) {
		await res.send('building room status data error');
		console.log(Error(err));
	}
});

// ROOM STATUS FOR WEEK DATA ROUTE
app.get('/buildings/:buildingId/:roomID/:week', async(req, res) => {
	try {
		console.log('room status for week successful')
	}
});

// WEEK NUM DATA ROUTE
app.get('/weekNum', async(req, res) => {
	try {
		console.log('weekNum successful')
	}
	catch (err) {
		await res.send('weekNum data error');
		console.log(Error(err));
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});