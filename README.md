# Freerooms
A web application designed to aide UNSW students in finding vacant rooms.

# scrape.js
The json object holding all the data passed to `app.js` from `scrape.js` as `courseDataList` is currently organised as follows (subject to change):

## courseDataList.json
> `Term` refers to any element from `['U1', 'T1', 'T2', 'T3']` (all will exist as of time of writing)

> `Location` refers to actual location such as `Keith Burrows Theatre (K-J14-G5)`

> `Day` refers to any element from `['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`

> `Time_Text` refers to text such as `"12:00 - 14:00"`

> `Weeks_Text` refers to text such as `"11"`
```json
[
	{
		"subjectCode": "facultyCode",
		"subjectName": "facultyName",
		"subjectURL": "facultyURL",
		"courses": [
			{
				"courseCode": "courseCode",
				"courseName": "courseName",
				"courseURL": "courseURL",
				"courseData": {
					"Term" : {
						"Location" : {
							"Day" : [
								{
									"time" : "Time_Text", 
									"weeks" : "Weeks_Text"
								}
							]
						}
					}
				}
			}
		]
	}
]
```
