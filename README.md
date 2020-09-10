# Freerooms
A web application designed to aide UNSW students in finding vacant rooms.

# scrape.js
The json object `data.json` holding all the data passed loaded into mongoDB is currently organised as follows (subject to change):

## data.json
> `Term` refers to any element from `['U1', 'T1', 'T2', 'T3']` (all will exist as of time of writing)

> `Location` refers to actual location such as `Keith Burrows Theatre (K-J14-G5)`

> `CourseCode` refers to course code such as `COMP2041` or `MGMT1001`

> `Day` refers to any element from `['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`

> `Week` refers to text such as `['0', '1', '2', ... '15']`

> `Time_Text` refers to text such as `"12:00 - 14:00"`
```json
{
	"Term": {
		"Location": {
			"CourseCode": {
				"Week": {
					"Day": ["Time_Text"]
				}
			}
		}
	}
}
```
