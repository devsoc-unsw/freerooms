// NODE APP INIT
const express = require('express');
const app = express();
const port = 1337;

// MODULES
const scraper = require('./app_modules/scrape.js');

// INDEX ROUTE
app.get('/', async (req, res) => {
	// call scraper with scrapeCourseList function and print
	try {
		let typeList = await scraper.scrapeCourseTypeList();
		let courseList = await scraper.scrapeCourseCodeList(typeList);
		res.send(courseList);
		console.log('printed message');
	}
	catch (err) {
		await res.send('unexpected error has occured');
		console.log(Error(err));
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});