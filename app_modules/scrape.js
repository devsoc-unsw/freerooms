// CONSTS
const TIMETABLE_URL ='http://timetable.unsw.edu.au/current';

// MODULES
const puppeteer = require('puppeteer');

// LIBRARIES
// import { cloneDeep } from "lodash"

// SCRAPE FUNCTIONS

// scrapes current timetable for current UNSW subject areas
var scrapeCourseTypeList = (async() => {
	try {
		// remove no sandbox later when with debian;
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		console.log('loaded browser');
		const page = await browser.newPage();
		console.log('loaded newPage');

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		await page.goto(TIMETABLE_URL, {waitUntil: 'domcontentloaded'});
		console.log('loaded url');

		// get raw list rows and get course code info
		const result = await page.evaluate(() => {
			let container = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
			let list = container.map((e) => {

				// firstElementChild is a dirty fix that will break URLS if UNSW changes how URL is put out
				let object = {
					"subjectCode": e.cells[0].innerText,
					"subjectName": e.cells[1].innerText,
					"subjectURL": e.cells[0].firstElementChild.href,
					"courses": null
				};

				return object;
			});
			return list;
		});

		await browser.close();
		return result;
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	};
});

// scrapes current timetable for current UNSW courses seperated under each subject area
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

		// extract and process course info and seperate as per each subject area
		for (var i = 0; i < typeList.length; i++) {
			// retrieve URL and goto
			console.log('retrieve url for ' + typeList[i].subjectCode);
			await page.goto(typeList[i].subjectURL, {waitUntil: 'domcontentloaded'});
			console.log('loaded subject url for ' + typeList[i].subjectCode);

			// evaluate page and retrieve relevant data
			const result = await page.evaluate(() => {
				let container = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
				let list = container.map((e) => {

					// object template for course array
					let object = {
						"courseCode": e.cells[0].innerText,
						"courseName": e.cells[1].innerText,
						"courseURL": e.cells[0].firstElementChild.href,
						"courseData": null
					};
					return object;

				});
				return list;
			});

			// save results onto appropriate subject json value
			typeList[i].courses = result;
		};

		await browser.close();
		return typeList; 
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
});

// scrapes time and location data of each occupied room per each courses schedule (Rohan's Flawed Timelist + Kim's Refactor)
var scrapeCourseDataList = (async(typeList) => {
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
		console.log("SUBJ length: " + typeList.length);

		// loop through each subject area
		for (var i = 0; i < typeList.length; i++) {
			console.log(i);
			console.log('retrieve course list for ' + typeList[i].subjectCode);
			let courseList = typeList[i].courses;
			console.log('loaded course list for ' + typeList[i].subjectCode);

			// loop through each course of that subject area
			console.log("SUBJ course length: " + courseList.length);
			for (var j = 0; j < courseList.length; j++) {
				//console.log('retrieve url for ' + courseList[j].courseCode);
				await page.goto(courseList[j].courseURL, {waitUntil: 'domcontentloaded'});
				//console.log('loaded course URL for ' + courseList[j].courseCode);

				// Initialise existence of courseData
				courseList[j].courseData = {};

				// term enumeration (add more as needed - will need to be changed if UNSW changes how they serve the data)
				// Note 1: group matches table text (appended with "Detail") above start of classes for that term
				// Note 2: individual matches text beside "Teaching Period" for each class/tutorial
				const terms = {
					"U1": 'U1 - Summer Teaching Period',
 					"T1": 'T1 - Teaching Period One',
					"T2": 'T2 - Teaching Period Two',
					"T3": 'T3 - Teaching Period Three'
				};

				// loop over each term for class and grab required information
				for (var termsKey in terms) {
					// code is courseCode for debugging purposes
					const result = await page.evaluate((termsvalue, code) => {
						// xpath query to find the table for specified term
						let xpath = `//table[tbody[tr[td[contains(text(), '${termsvalue}')]]]]`;
						// evaluate query and get elements we need to work with
						let elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
						// get our first element (null if non-existent)
						var elemIter = elements.iterateNext();
						// early return with null if course doesn't run this term
						if (!elemIter) { return null; }

						// iterate each of the tables for each specific term and generate courseData with location and times
						var courseData = {};
						while (elemIter) {
							let container = elemIter.querySelectorAll('.rowLowLight, .rowHighLight');
							container.forEach((e) => {
								let location = e.cells[2].innerText;
								if (!(location in courseData)) {
									// initialise location
									courseData[location] = {
										"Mon": {},
										"Tue": {},
										"Wed": {},
										"Thu": {},
										"Fri": {},
										"Sat": {},
										"Sun": {}
									};
								}

								// TODO: problems with WEEKS N1 and some weird formats with `<1` etc.
								let days = e.cells[0].innerText.split(',');
								let times = e.cells[1].innerText; //.split(',') UNUSED;
								let weeks = e.cells[3].innerText.split(',');
								for (var day of days) {
									day = day.trim();
									if (!courseData[location][day]) { continue; };

									for (var week of weeks) {
										week = week.trim();

										// match on week regex (either single or range), otherwise error
										if (week.match(/^[0-9]+$/)) {
											if (!courseData[location][day][week]) { courseData[location][day][week] = [] };
											courseData[location][day][week].push(times);
										}
										else if (week.match(/^([0-9]+)-([0-9]+)$/)) {
											var weekmatch = week.match(/^([0-9]+)-([0-9]+)$/);
											const start = parseInt(weekmatch[1]);
											const end = parseInt(weekmatch[2]);
											for (weekIter = start; weekIter <= end; weekIter++) {
												if (!courseData[location][day][weekIter]) { courseData[location][day][weekIter] = [] };
												courseData[location][day][weekIter].push(times);
											}
										}
										else {
											console.log("\n\nERROR:" + code + "\n>" + day + "<\n" + days + "\nWEEK: >" + week + "<\n" + weeks + "\n\n");
										}
									}
								}
							});
                            elemIter = elements.iterateNext();
						}
						return courseData;
					}, terms[termsKey], courseList[j].courseCode);
					// link data to each term in json object of each course
					courseList[j].courseData[termsKey] = result;
				}
			}
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

// EXPORT FUNCTIONS
exports.scrapeCourseTypeList = scrapeCourseTypeList;
exports.scrapeCourseCodeList = scrapeCourseCodeList;
exports.scrapeCourseDataList = scrapeCourseDataList;