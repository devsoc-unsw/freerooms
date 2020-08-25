// CONSTS
const TIMETABLE_URL ='http://timetable.unsw.edu.au/2020/subjectSearch.html';

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

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		await page.goto(TIMETABLE_URL);
		console.log('loaded url');

		// get raw list rows and get course code info
		const result = await page.evaluate(() => {
			let container = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
			let list = container.map(function(e) {

				// firstElementChild is a dirty fix that might break everything 
				// if unsw change how they set up the child elements
				let object = {
					"code": e.cells[0].innerText,
					"name": e.cells[1].innerText,
					"url": e.cells[0].firstElementChild.href,
					"course": null
				};

				return object;
			});
			return list;
		});

		// close the browser and return the list
		await browser.close();
		//console.log(result);
		return result;
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	};
});

var scrapeCourseCodeList = (async(typeList) => {
	try {
		// remove no sandbox later when with debian
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		console.log('loaded browser');
		const page = await browser.newPage();
		console.log('loaded newPage');

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		//console.log(typeList);
		// Begin Loop to extract data (HOW TO MAKE THIS FASTER? IT'S SLOW AS FUCK. NEED MORE PARALLELISATION)
		for (var i = 0; i < typeList.length; i++) {
			// retrieve URL and goto
			console.log('retrieve url for ' + typeList[i].code);
			let codeURL = typeList[i].url;
			await page.goto(codeURL);
			console.log('loaded course url');

			// evaluate page and retrieve data
			const result = await page.evaluate(() => {
				let container = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
				let list = container.map(function(e) {
					// object template for course array
					let object = {
						"code": e.cells[0].innerText,
						"name": e.cells[1].innerText,
						"url": e.cells[0].firstElementChild.href
					};

					return object;
				});
				return list;
			});

			// link list onto json array
			typeList[i].course = result;
			//console.log(codeURL);
			//console.log(typeList[i].course.length);
		};

		await browser.close(); // early close
		return typeList; 
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
});

// Rohan's Flawed Timelist
var scrapeCourseTimeList = (async (codeList) => {
	try {
		// remove no sandbox later when with debian
		const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		console.log('loaded browser');
		const page = await browser.newPage();
		console.log('loaded newPage');

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		var times = {};

		// Loop through each course type
		for (var i = 0; i < codeList.length; i++) {
			console.log('retrieve course list for ' + codeList[i].code);
			let courseList = codeList[i].course;
			console.log('loaded course list');

			// loop through each course of that type
			for (var j = 0; j < courseList.length; j++) {
				console.log('retrieve url for ' + courseList[j].code);
				let courseURL = courseList[j].url;
				await page.goto(courseURL);
				console.log('loaded course URL');

				// courseList and j parameters are only used for debugging
				const result = await page.evaluate((times, courseList, j) => {
					// xpath query to find the table for term one (hardcoded for now)
					let xpath = "//table[tbody[tr[td[contains(text(), 'TERM ONE CLASSES - Detail')]]]]"
					// evaluate the query and get only the first element (should only be one)
					let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

					// if element not found we don't do anything
					// this will occurr if a course doesn't run in term one
					if (!element) {
						return times;
					}

					// the table with the time data is actually after the table that we found
					element = element.nextElementSibling;

					let container = element.querySelectorAll('.rowLowLight, .rowHighLight');
					container.forEach(function (elem) {
						let location = elem.cells[2].innerText;
						if (!(location in times)) {
							times[location] = {
								"Mon": [],
								"Tue": [],
								"Wed": [],
								"Thu": [],
								"Fri": [],
								"Sat": [],
								"Sun": []
							};
						}
						if (times[location][elem.cells[0].innerText]) {
							times[location][elem.cells[0].innerText].push({
								"time": elem.cells[1].innerText,
								"weeks": elem.cells[3].innerText
							});
						} else {
							console.log("\n\n" + courseList[j].code + location + "\n\n");
						}
					});
					return times;

				}, times, courseList, j);
				// changes to the object 'times' aren't saved so reassign it
				times = result;
			}

		};

		await browser.close(); // early close
		return times;
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
});

// EXPORT FUNCTIONS
exports.scrapeCourseTypeList = scrapeCourseTypeList;
exports.scrapeCourseCodeList = scrapeCourseCodeList;
exports.scrapeCourseTimeList = scrapeCourseTimeList;