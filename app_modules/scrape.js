// CONSTS
const TIMETABLE_URL = 'http://timetable.unsw.edu.au/2019/subjectSearch.html';

// MODULES
const puppeteer = require('puppeteer');

// SCRAPE FUNCTIONS

// can be improved to reference by year (cbf to do it right now)
var scrapeCourseTypeList = (async() => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(TIMETABLE_URL);

		// get raw list rows and get course code inner text from first cell
		const result = await page.evaluate(() => {
			let rawList = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
			let list = rawList.map(function(e) { return e.cells[0].innerText; });
			return list;
		})

		// close the browser and return the list
		await browser.close();
		// console.log(result);
		return result;
	}
	catch (err) {
		console.log(error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
})

// EXPORT FUNCTIONS
exports.scrapeCourseTypeList = scrapeCourseTypeList;