const cron = require("node-cron");

//ADD CRON JOB TO GET DATA EVERY 2 WEEKS FROM THE SCRAPER
cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});
