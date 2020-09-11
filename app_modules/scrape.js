// CONSTS
const TIMETABLE_URL ='http://timetable.unsw.edu.au/current';

// MODULES
const puppeteer = require('puppeteer');

// LIBRARIES
// your libraries here (try importing only functions you need)
var lodashMerge = require('lodash/merge')

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

		// CONSOLE.LOG CODEBLOCK
		page.on('console', (log) => console[log._type](log._text));
		console.log('loaded page eval console.log');
		////////////////////////

		// init object for terms
		var termsObj = {};

		// term enumeration (add more as needed - will need to be changed if UNSW changes how they serve the data)
		// Note 1: group matches table text (appended with "Detail") above start of classes for that term
		// Note 2: individual matches text beside "Teaching Period" for each class/tutorial
		const terms = {
			"U1": 'U1 - Summer Teaching Period',
			"T1": 'T1 - Teaching Period One',
			"T2": 'T2 - Teaching Period Two',
			"T3": 'T3 - Teaching Period Three'
		};

		// course count
		//console.log(courseList.length);

		// iterate through the courselist and retrieve data as necessary
		for (var courseIter = 0; courseIter < courseList.length; courseIter++) {
			//console.log('retrieve url for ' + courseList[courseIter].courseCode);
			await page.goto(courseList[courseIter].courseURL, {waitUntil: 'domcontentloaded'});
			//console.log('loaded course URL for ' + courseList[courseIter].courseCode);

			// loop over each term
			for (var termsKey in terms) {
				//console.log(`###################### loaded term: ${termsKey} ######################`);

				// code is courseCode for debugging purposes
				const result = await page.evaluate((termsvalue, courseObj) => {
					// xpath query to find the table for specified term
					const xpath = `//table[tbody[tr[td[contains(text(), '${termsvalue}')]]]]`;
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
						const container = elemIter.querySelectorAll('.rowLowLight, .rowHighLight');
						container.forEach((e) => {
							// TODO: Regex the location to use stuff inside parenthesis (from the end) as building code and rest as name
							const location = e.cells[2].innerText;
							// initialise location if it doesn't exist yet
							if (!(location in returnData)) {
								returnData[location] = {};
							}

							// assign location object by reference for easier use
							var currLocation = returnData[location];

							const weeks = e.cells[3].innerText.split(',');
							const days = e.cells[0].innerText.split(',');
							const times = e.cells[1].innerText; //.split(','); UNUSED
							// loop through weeks
							for (var week of weeks) {
								week = week.trim();
								// match on week regex (either single or range), otherwise error
								// TODO: the logic for week matching is really hacky atm. if anyone knows a better way, feel free to make a PR
								// TODO: problems with WEEKS N1 and some weird formats with `<1` etc.
								if (week.match(/^([0-9]+)-([0-9]+)$/)) {
									var weekmatch = week.match(/^([0-9]+)-([0-9]+)$/);
									const start = parseInt(weekmatch[1]);
									const end = parseInt(weekmatch[2]);
									for (var weekIter = start; weekIter <= end; weekIter++) {
										if (!currLocation[weekIter]) { currLocation[weekIter] = {}; }
										
										// loop through days
										// TODO: No error checking for valid days for now
										// TODO: DRY principle needs to be adhered as i'm repeating code. this is only temp
										for (var day of days) {
											day = day.trim();
											if (!currLocation[weekIter][day]) { currLocation[weekIter][day] = []; }
											// push times and relevant course to array
											var pushObj = {
												"courseCode": courseObj.courseCode,
												"times": times
											};
											currLocation[weekIter][day].push(pushObj);
											// TODO: this should never trigger for now while no error checking
											/* else {
												console.log("\n\nDAY ERROR:" + courseObj.courseCode + "\n>" + day + "<\n" + days + "\n\n");
												continue;
											} */
										}
									}
								}
								else if (week.match(/^[0-9]+$/)) {
									if (!currLocation[week]) { currLocation[week] = {}; }
									// loop through days
									// TODO: No error checking for valid days for now
									// TODO: DRY principle needs to be adhered as i'm repeating code. this is only temp
									for (var day of days) {
										day = day.trim();
										if (!currLocation[week][day]) { currLocation[week][day] = []; }
										// push times and relevant course to array
										var pushObj = {
											"courseCode": courseObj.courseCode,
											"times": times
										};
										currLocation[week][day].push(pushObj);
										// TODO: this should never trigger for now while no error checking
										/* else {
											console.log("\n\nDAY ERROR:" + courseObj.courseCode + "\n>" + day + "<\n" + days + "\n\n");
											continue;
										} */
									}
								}
								else {
									console.log("\n\nWEEK ERROR:" + courseObj.courseCode + "\n>" + week + "<\n" + weeks + "\n\n");
									continue;
								}
							}
						});
						elemIter = elements.iterateNext();
					}
					return returnData;
				}, terms[termsKey], courseList[courseIter]);
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