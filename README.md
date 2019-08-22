# Freerooms
A web application designed to aide UNSW students in finding vacant rooms.

# scrape.js
> The json object holding all the data passed to `app.js` from `scrape.js` as `courseCodeList` will be organised as follows:

```json
{
	"code": "facultyCode",
	"name": "facultyName",
	"url": "facultyURL",
	"course": [
		"code", "courseCode",
		"name", "courseName",
		"url", "courseURL"
	]
};
```