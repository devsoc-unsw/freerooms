// CONSTS
const TIMETABLE_URL ='http://timetable.unsw.edu.au/current';
// term enumeration (add more as needed - will need to be changed if UNSW changes how they serve the data)
// Note 1: group matches table text (appended with "Detail") above start of classes for that term
// Note 2: individual matches text beside "Teaching Period" for each class/tutorial
const TERMS = {
	"U1": { "val": 'U1 - Summer Teaching Period', "idx": 0 },
	"T1": { "val": 'T1 - Teaching Period One', "idx": 1},
	"T2": { "val": 'T2 - Teaching Period Two', "idx": 2},
	"T3": { "val": 'T3 - Teaching Period Three', "idx": 3}
};

// MODULES
const puppeteer = require('puppeteer');
const dateconvert = require('./date.js');

// LIBRARIES
// your libraries here (try importing only functions you need)
var lodashMerge = require('lodash/merge');

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

		// init courses
		var courseList = [];

		// extract and process course info and seperate as per each subject area
		for (var subjIter = 0; subjIter < typeList.length; subjIter++) {
			// retrieve URL and goto
			console.log('retrieve url for ' + typeList[subjIter].subjectCode);
			await page.goto(typeList[subjIter].subjectURL, {waitUntil: 'domcontentloaded'});
			console.log('loaded subject url for ' + typeList[subjIter].subjectCode);

			// evaluate page and retrieve relevant data
			const result = await page.evaluate((subjObj) => {
				var container = Array.from(document.querySelectorAll('.rowLowLight, .rowHighLight'));
				var list = container.map((e) => {

					// object template for course array
					var object = {
						"subjectCode": subjObj.subjectCode,
						"subjectName": subjObj.subjectName,
						"subjectURL": subjObj.subjectURL,
						"courseCode": e.cells[0].innerText,
						"courseName": e.cells[1].innerText,
						"courseURL": e.cells[0].firstElementChild.href,
					};
					return object;

				});
				return list;
			}, typeList[subjIter]);

			// push results onto courselist with evil ECMASCript 6 spread syntax
			courseList.push(...result);
		};

		await browser.close();
		return courseList; 
	}
	catch (err) {
		console.log(Error(err));
		await browser.close(); // close the browser so no lingering instances
		return Error(err);
	}
});

// scrapes time and location data of each occupied room per each courses schedule (Rohan's Flawed Timelist + Kim's Refactor)
var scrapeCourseDataList = (async(courseList) => {
	try {
		// remove no sandbox later when with debian
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		console.log('loaded browser');
		const page = await browser.newPage();
		console.log('loaded newPage');
		// expose needed functions to page.evaluate
		await page.exposeFunction('weekToDate', dateconvert.weekToDate);
		console.log('loaded dateconvert module')

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		// init object for terms
		var termsObj = {};

		// generate calender date information
		var keyDates = await dateconvert.keyDatesDict();

		// iterate through the courselist and retrieve data as necessary
		for (var courseIter = 0; courseIter < courseList.length; courseIter++) {
			//console.log('retrieve url for ' + courseList[courseIter].courseCode);
			await page.goto(courseList[courseIter].courseURL, {waitUntil: 'domcontentloaded'});
			//console.log('loaded course URL for ' + courseList[courseIter].courseCode);

			// loop over each term
			for (var termsKey in TERMS) {
				//console.log(`###################### loaded term: ${TERMS[termsKey].val} ######################`);

				// TODO: reduce parameters to PARAM object and modules to MODUKE object
				// evaluate the course and create object
				const result = await page.evaluate(async(termvalue, termindex, courseObj, keyDates) => {
					// xpath query to find the table for specified term
					const xpath = `//table[tbody[tr[td[contains(text(), '${termvalue}')]]]]`;
					// evaluate query and get elements we need to work with
					const elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
					// get our first element (null if non-existent)
					var elemIter = elements.iterateNext();
					// early return with null if course doesn't run this term
					if (!elemIter) { return null; }

					// NOTE: maybe we can make elemIter a for loop?
					// iterate each of the tables for each specific term and generate returnData with terms, locations, weeks, days and times
					var returnData = {};
					while (elemIter) {
						const container = Array.from(elemIter.querySelectorAll('.rowLowLight, .rowHighLight'));
						// evil async foreach hacks from google
						// source: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
						async function asyncForEach(array, callback) {
							for (let index = 0; index < array.length; index++) {
								await callback(array[index], index, array);
							}
						}
						await asyncForEach(container, async(e) => {
							// regex the location to split into name, building code and room code
							// ONLINE: |^.* +\(ONLINE\)$
							const location = e.cells[2].innerText.trim().match(/^(.*) +\((.*-.*)-(.*)\)$/);
							const name = (location == null) ? "ONLINE" : location[1];
							const building = (location == null) ? "ONLINE" : location[2];
							const room = (location == null) ? "ONLINE" : location[3];
							// initialise location building if it doesn't exist yet
							if (!(building in returnData)) {
								returnData[building] = {};
							}
							// initialise location room if it doesn't exist yet
							if (!(room in returnData[building])) {
								returnData[building][room] = {};
							}

							// assign location object by reference for easier use
							var currLocation = returnData[building][room];

							const weeks = e.cells[3].innerText.split(',');
							const days = e.cells[0].innerText.split(',');
							const times = e.cells[1].innerText.trim(); //.split(','); UNUSED
							// loop through weeks
							for (var week of weeks) {
								week = week.trim();

								// day helper function
								var dayHelper = (async(currLocation, week, days, times, name) => {
									// CONSTS
									const TIME_REGEX = /^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]) - ((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])$/;
									// TODO: make a way to create this automatically from date.js
									const YEAR = 2020;
									const DATE_OPTION = 1;

									// loop through days
									// TODO: No error checking for valid days for now
									for (var day of days) {
										day = day.trim();
										if (!currLocation[week][day]) { currLocation[week][day] = { "name": name, "classes": [] }; }
										// ensure times is of correct format
										if (times.match(TIME_REGEX)) {
											// get date
											const pushDate = await weekToDate(keyDates, YEAR, termindex, week, day, DATE_OPTION);
											var timeObj = times.match(TIME_REGEX);
											// push times and relevant course to array
											var pushObj = {
												"courseCode": courseObj.courseCode,
												"start": `${pushDate} ${timeObj[1]}`,
												"end": `${pushDate} ${timeObj[3]}`
											};
											currLocation[week][day].classes.push(pushObj);
										}
										else {
											console.log("\n\nTIME ERROR:" + courseObj.courseCode + "\n>" + times + "<\n\n");
											continue;
										}
										// TODO: this should never trigger for now while no error checking
										/* else {
											console.log("\n\nDAY ERROR:" + courseObj.courseCode + "\n>" + day + "<\n" + days + "\n\n");
											continue;
										} */
									}
								});
								// match on week regex (either single or range), otherwise error
								// TODO: the logic for week matching is really hacky atm. if anyone knows a better way, feel free to make a PR
								// TODO: problems with WEEKS N1 and some weird formats with `<1` etc.
								if (week.match(/^([0-9]+)-([0-9]+)$/)) {
									var weekmatch = week.match(/^([0-9]+)-([0-9]+)$/);
									const start = parseInt(weekmatch[1]);
									const end = parseInt(weekmatch[2]);
									for (var weekIter = start; weekIter <= end; weekIter++) {
										if (!currLocation[weekIter]) { currLocation[weekIter] = {}; }
										await dayHelper(currLocation, weekIter, days, times, name);
									}
								}
								else if (week.match(/^[0-9]+$/)) {
									if (!currLocation[week]) { currLocation[week] = {}; }
									await dayHelper(currLocation, week, days, times, name);
									//console.log(JSON.stringify(currLocation));
								}
								else {
									console.log("\n\nWEEK ERROR:" + courseObj.courseCode + "\n>" + week + "<\n" + weeks + "\n\n");
									continue;
								}
							}
						});
						elemIter = elements.iterateNext();
					}
					//console.log(JSON.stringify(returnData));
					return returnData;
				}, TERMS[termsKey].val, TERMS[termsKey].idx, courseList[courseIter], keyDates);
				// merge objects using lodash
				termsObj[termsKey] = lodashMerge({},termsObj[termsKey], result);
			}
			console.log(`completed course ${courseList[courseIter].courseCode} - ${courseIter} of ${courseList.length}`)
		};

		await browser.close(); // early close
		return termsObj;
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