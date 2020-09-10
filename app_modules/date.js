// CONSTS
const CALENDAR_URL ='https://student.unsw.edu.au/calendar';
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// MODULES
const puppeteer = require('puppeteer');

// scrapes current academic calendar for key dates
let scrapeKeyDatesDict = (async() => {
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

		await page.goto(CALENDAR_URL, {waitUntil: 'domcontentloaded'});
		console.log('loaded url');

		// get key dates as dictionary
		const result = await page.evaluate(() => {
			const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

            let yearInfo = document.querySelector('.table-striped').querySelector('tr');
			let container = [];
			document.querySelectorAll('.table-striped').forEach(el => container.push(el.querySelectorAll('tr')[1]));
            let dict = {};

            // For each year on the page, store term data in array
            yearInfo.querySelectorAll('td').forEach(el => {
            	if (el.innerText == "YEAR") return; // Handle label case
            	let yearList = [];
            	container.map((e) => {

					// Get raw dates string from table
					let dateString = e.querySelectorAll('td')[Array.from(yearInfo.querySelectorAll('td')).indexOf(el)].innerText;
					dateString = dateString.replace("\n", ""); // strip whitespace

					// dirty fix - set all 'words' to be 3 characters long (for month->num conversion)
					let d = [];
					dateString.split(" ").forEach(word => d.push(word.substr(0, 3)));
					dateString = d.join(" ")

					// split dateString into an array
					let dates = [];
					dateString.split("-").forEach(date => dates.push(date.trim()))

					// Construct object to store relevant information about term
					let year = el.innerText;
					let startDate = new Date(year, MONTHS.indexOf(dates[0].replace(/[0-9 ]+/g, "").toUpperCase()), Number(dates[0].replace(/[A-Za-z ]+/g, "")), 0, 0, 0, 0);
					let endDate = new Date(year, MONTHS.indexOf(dates[1].replace(/[0-9 ]+/g, "").toUpperCase()), Number(dates[1].replace(/[A-Za-z ]+/g, "")), 0, 0, 0, 0);
					let term = e.querySelectorAll('td')[0].innerText;

					// Dirty fix - if term starts on Sunday, then set it to start on Monday
					if (startDate.getDay() == 0) startDate.setDate(startDate.getDate() + 1);

					// Dirty fix - if term starts on Tuesday, then set it to start on Monday
					if (startDate.getDay() == 2) startDate.setDate(startDate.getDate() - 1);

					let object = {
						"term": term,
						"start": startDate.toDateString(),
						"end": endDate.toDateString()
					};
					yearList.push(object);
				});
            	dict[el.innerText] = yearList;
			});
			return dict;
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

// Stolen from StackOverflow because I like the style
// https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

// Rudimentary method to convert week num + day to date
// NOTE: Only works if the key dates object starts terms on a Monday
//
// res = response object from scrapeKeyDatesDict
// year = year as a string/number
// term = term as a number (summer term is 0, term 1 is 1, etc.)
// week = week number
// day = day as a string (eg. "Thu", "Thurs", "Thursday", etc.)
let weekToDate = (res, year, term, week, day) => {
	week -= 1; // Handle week number being 1-indexed
	day = day.substr(0, 3); // Grab the start of the day just in case it isn't passed in correctly

	// Get start of term for reference
	let start = res[year.toString()][term]["start"];

	// Calculate target date
	let date = new Date(start);
	date.addDays(week * 7 + DAYS.indexOf(day));

	return date.toDateString();
};

// EXPORTS
exports.keyDatesDict = scrapeKeyDatesDict;
exports.weekToDate = weekToDate;
