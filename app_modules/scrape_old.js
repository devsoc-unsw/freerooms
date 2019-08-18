// CONSTS
const TIMETABLE_URL = 'http://timetable.unsw.edu.au/2019/subjectSearch.html';

// MODULES
const puppeteer = require('puppeteer');

// SCRAPE FUNCTIONS

// can be improved to reference by year (cbf to do it right now)
var scrapeCourseTypeList = (async() => {
	try {
		// remove no sandbox later when with debian
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		console.log('loaded browser');
		const page = await browser.newPage();
		console.log('loaded newPage');
		await page.goto(TIMETABLE_URL);
		console.log('url');

		// get raw list rows and get course code info
		const result = await page.evaluate(() => {
			let rawList = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
			return rawList;
			// list returned is a array of DOM's
			//let list = rawList.map(function(e) { return e.cells[0].innerText; });
			//return list;
		})

		// close the browser and return the list
		await browser.close();
		// console.log(result);
		return result;
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
})

//
var scrapeCourseCodeList = (async(typeList) => {
	try {
		// remove no sandbox later when with debian
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		//const page = await browser.newPage();

		await browser.close(); // early close
		return typeList; 
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
})

// EXPORT FUNCTIONS
exports.scrapeCourseTypeList = scrapeCourseTypeList;
exports.scrapeCourseCodeList = scrapeCourseCodeList;