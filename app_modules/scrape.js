// CONSTS
const TIMETABLE_URL = "http://timetable.unsw.edu.au/current";
// term enumeration (add more as needed - will need to be changed if UNSW changes how they serve the data)
// Note 1: group matches table text (appended with "Detail") above start of classes for that term
// Note 2: individual matches text beside "Teaching Period" for each class/tutorial
const TERMS = {
  U1: { val: "U1 - Summer Teaching Period", idx: 0 },
  T1: { val: "T1 - Teaching Period One", idx: 1 },
  T2: { val: "T2 - Teaching Period Two", idx: 2 },
  T3: { val: "T3 - Teaching Period Three", idx: 3 },
};

// MODULES
const puppeteer = require("puppeteer");
const dateConverter = require("./date.js");

// LIBRARIES
// Your libraries here (try importing only functions you need to increase performance)
let lodashMerge = require("lodash/merge");

// SCRAPE FUNCTIONS
// Scrapes current timetable for current UNSW subject areas and their associated courses' timetables
const scrapeCourseTypeList = async () => {
  try {
    // Create new browser and page
    // TODO remove no sandbox later when with debian;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Loaded browser");

    const page = await browser.newPage();
    console.log("Loaded new page");

    // TODO what does this do??
    //////////////////////////// CONSOLE.LOG CODEBLOCK ////////////////////////////
    page.on("console", log => console[log._type](log._text));
    console.log("loaded page eval console.log");
    ///////////////////////////////////////////////////////////////////////////////

    // Visit timetable page
    await page.goto(TIMETABLE_URL, { waitUntil: "domcontentloaded" });
    console.log("Loaded UNSW timetable");

    // Get raw list rows in subject area timetabl
    // Extract subject area code, name and link to corresponding timetabling page
    const result = await page.evaluate(() => {
      let container = Array.from(
        document.querySelectorAll(".rowLowLight, .rowHighLight")
      );
      let list = container.map(e => {
        // firstElementChild is a dirty fix that will break URLS if UNSW changes how URL is put out
        // TODO find better solution
        let object = {
          subjectCode: e.cells[0].innerText,
          subjectName: e.cells[1].innerText,
          subjectURL: e.cells[0].firstElementChild.href,
        };
        return object;
      });
      return list;
    });

    await browser.close();
    return result;
  } catch (err) {
    // Close browser so that there are no lingering instances
    await browser.close();
    console.log(Error(err));
    return Error(err);
  }
};

// Scrapes timetable for current UNSW courses seperated under each subject area
const scrapeCourseCodeList = async typeList => {
  try {
    // Create new browser and page
    // TODO remove no sandbox later when with debian
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Loaded browser");

    const page = await browser.newPage();
    console.log("Loaded new page");

    // TODO what does this do??
    //////////////////////////// CONSOLE.LOG CODEBLOCK ////////////////////////////
    page.on("console", log => console[log._type](log._text));
    console.log("loaded page eval console.log");
    ///////////////////////////////////////////////////////////////////////////////

    let courseList = [];

    // Extract and process course info
    for (let i = 0; i < typeList.length; i++) {
      // Retrieve URL for subject
      await page.goto(typeList[i].subjectURL, {
        waitUntil: "domcontentloaded",
      });
      console.log("Loaded timetable page for " + typeList[i].subjectCode);

      // Evaluate page and retrieve relevant data
      const result = await page.evaluate(subjObj => {
        let container = Array.from(
          document.querySelectorAll(".rowLowLight, .rowHighLight")
        );
        let list = container.map(e => {
          // firstElementChild is a dirty fix that will break URLS if UNSW changes how URL is put out
          // TODO find better solution
          let object = {
            subjectCode: subjObj.subjectCode,
            subjectName: subjObj.subjectName,
            subjectURL: subjObj.subjectURL,
            courseCode: e.cells[0].innerText,
            courseName: e.cells[1].innerText,
            courseURL: e.cells[0].firstElementChild.href,
          };
          return object;
        });
        return list;
      }, typeList[i]);

      // Push results onto courseList with evil ECMASCript 6 spread syntax
      courseList.push(...result);
    }

    await browser.close();
    return courseList;
  } catch (err) {
    // Close browser so that there are no lingering instances
    await browser.close();
    console.log(Error(err));
    return Error(err);
  }
};

// scrapes time and location data of each occupied room per each courses schedule (Rohan's Flawed Timelist + Kim's Refactor)
const scrapeCourseDataList = async courseList => {
  try {
    // Create new browser and page
    // TODO remove no sandbox later when with debian
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Loaded browser");

    const page = await browser.newPage();
    console.log("Loaded newPage");

    // Expose needed functions to page.evaluate
    await page.exposeFunction("weekToDate", dateConverter.weekToDate);
    console.log("Loaded dateConverter module");

    // TODO what does this do??
    //////////////////////////// CONSOLE.LOG CODEBLOCK ////////////////////////////
    page.on("console", log => console[log._type](log._text));
    console.log("loaded page eval console.log");
    ///////////////////////////////////////////////////////////////////////////////

    let termsObj = {};

    // Generate calender date information
    let keyDates = await dateConverter.scrapeKeyDates();

    // Iterate through the courseList and retrieve data for each course's timetable
    for (let i = 0; i < courseList.length; i++) {
      await page.goto(courseList[i].courseURL, {
        waitUntil: "domcontentloaded",
      });
      // console.log('Loaded course URL for ' + courseList[i].courseCode);

      // Loop over each term
      for (let termsKey in TERMS) {
        //console.log(`Loaded term: ${TERMS[termsKey].val}`);

        // Evaluate the course and create object to store timetable information for it
        const result = await page.evaluate(
          async (termValue, termIndex, courseObj, keyDates) => {
            // xpath query to find the table for specified term
            const xpath = `//table[tbody[tr[td[contains(text(), '${termValue}')]]]]`;

            // Evaluate query and get the elements we need
            const elements = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.ORDERED_NODE_ITERATOR_TYPE,
              null
            );

            // TODO change XPathResult.ORDERED_NODE_ITERATOR_TYPE to XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
            // See https://stackoverflow.com/questions/48235278/xpath-error-the-document-has-mutated-since-the-result-was-returned

            // Get our first element (null if non-existent). Early return with null if course doesn't run this term
            let elemIter = elements.iterateNext();
            if (!elemIter) return null;

            // Iterate through each of the tables for each term
            // Then generate returnData object with terms, locations, weeks, days and times

            // Key: building code
            // Values: an object for each room

            // For room object:
            // Key: room code
            // Values: course code, start time and end time of class in that room (which is an object)

            let returnData = {};

            // TODO: maybe we can make elemIter a for loop?
            while (elemIter) {
              const container = Array.from(
                elemIter.querySelectorAll(".rowLowLight, .rowHighLight")
              );

              // Evil async foreach hacks from google
              // Source: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
              async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                  await callback(array[index], index, array);
                }
              }

              await asyncForEach(container, async e => {
                // Apply regex to the location to split into name, building code and room code
                // ONLINE: |^.* +\(ONLINE\)$
                const location = e.cells[2].innerText
                  .trim()
                  .match(/^(.*) +\((.*-.*)-(.*)\)$/);
                const name = location == null ? "ONLINE" : location[1];
                const building = location == null ? "ONLINE" : location[2];
                const room = location == null ? "ONLINE" : location[3];

                // Initialise location building if it doesn't exist yet
                if (!(building in returnData)) {
                  returnData[building] = {};
                }

                // Initialise location room if it doesn't exist yet
                if (!(room in returnData[building])) {
                  returnData[building][room] = { name: name };
                }

                // Assign location object by reference for easier use
                let currLocation = returnData[building][room];

                const weeks = e.cells[3].innerText.split(",");
                const days = e.cells[0].innerText.split(",");
                const times = e.cells[1].innerText.trim(); //.split(','); UNUSED

                // Loop through weeks
                for (let week of weeks) {
                  week = week.trim();

                  // Helper function to generate class data for a room
                  // This will contain the data for all classes for a particular week and day in the given room
                  // For each day of week, every class' course code, start time and end time will be stored in an array
                  const dayHelper = async (currLocation, week, days, times) => {
                    // TODO: make a way to create this automatically from date.js
                    const TIME_REGEX = /^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]) - ((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])$/;
                    // TODO: generate year programatically
                    const YEAR = 2021;
                    const DATE_OPTION = 1;

                    // Loop through days
                    // TODO: No error checking for valid days for now
                    for (let day of days) {
                      day = day.trim();

                      // Initialise array of classes for the current day of the current week in the given room
                      if (!currLocation[week][day])
                        currLocation[week][day] = [];

                      // Ensure times are of the correct format
                      if (times.match(TIME_REGEX)) {
                        // Convert nth week and day to an actual date
                        const convertedDate = await weekToDate(
                          keyDates,
                          YEAR,
                          termIndex,
                          week,
                          day,
                          DATE_OPTION
                        );

                        // TODO this can't be right? what does this do
                        let timeObj = times.match(TIME_REGEX);

                        // Push class data to the array
                        let classData = {
                          courseCode: courseObj.courseCode,
                          start: `${convertedDate} ${timeObj[1]}`,
                          end: `${convertedDate} ${timeObj[3]}`,
                        };

                        currLocation[week][day].push(classData);
                      } else {
                        console.log(
                          "\n\nTIME ERROR:" +
                            courseObj.courseCode +
                            "\n>" +
                            times +
                            "<\n\n"
                        );
                        continue;
                      }
                      // TODO: this should never trigger for now while no error checking
                      /* else {
                        console.log("\n\nDAY ERROR:" + courseObj.courseCode + "\n>" + day + "<\n" + days + "\n\n");
                        continue;
										  } */
                    }
                  };

                  // Ensure week matches regex (either a single week or range of weeks)
                  // TODO the logic for week matching is really hacky atm. if anyone knows a better way, feel free to make a PR
                  // TODO problems with WEEKS N1 and some weird formats with `<1` etc.
                  if (week.match(/^([0-9]+)-([0-9]+)$/)) {
                    let weekMatch = week.match(/^([0-9]+)-([0-9]+)$/);
                    let start = parseInt(weekMatch[1]);
                    let end = parseInt(weekMatch[2]);
                    for (let currWeek = start; currWeek <= end; currWeek++) {
                      if (!currLocation[currWeek]) currLocation[currWeek] = {};
                      await dayHelper(currLocation, currWeek, days, times);
                    }
                  } else if (week.match(/^[0-9]+$/)) {
                    if (!currLocation[week]) currLocation[week] = {};
                    await dayHelper(currLocation, week, days, times);
                  } else {
                    console.log(
                      "\n\nWEEK ERROR:" +
                        courseObj.courseCode +
                        "\n>" +
                        week +
                        "<\n" +
                        weeks +
                        "\n\n"
                    );
                    continue;
                  }
                }
              });
              elemIter = elements.iterateNext();
            }
            return returnData;
          },
          TERMS[termsKey].val,
          TERMS[termsKey].idx,
          courseList[i],
          keyDates
        );

        // Merge result with current term data using lodash
        termsObj[termsKey] = lodashMerge({}, termsObj[termsKey], result);
      }

      console.log(
        `Completed course ${courseList[i].courseCode} - ${i} of ${courseList.length}`
      );
    }

    await browser.close();
    return termsObj;
  } catch (err) {
    // Close browser so that there are no lingering instances
    await browser.close();
    console.log(Error(err));
    return Error(err);
  }
};

// EXPORT FUNCTIONS
exports.scrapeCourseTypeList = scrapeCourseTypeList;
exports.scrapeCourseCodeList = scrapeCourseCodeList;
exports.scrapeCourseDataList = scrapeCourseDataList;
