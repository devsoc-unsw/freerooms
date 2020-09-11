# Requests to backend from frontend

** Array of all rooms in a specified building, with their booked times for a specified date. **
Request from frontend would supply the room name, a starting date and an ending date.

An example building name could be: `Keith Burrows`
The date would follow the format: `YYYY-MM-DD`. This will need conversion.

Desired output follows format:
```
[
    "room_name": [
        {
            "start": "YYYY-MM-DD hh" // Booking start time.
            "end": "YYYY-MM-DD hh"   // Booking end time.
        }
    ]
]
```
An example room_name could be: `Keith Burrows Theatre (K-J14-G5)`
A course name for each date pair is also beneficial, but not necessary yet.


** All booked times for a specific room in a specified date range. **
Request from frontend would supply the room name, a starting date and an ending date.

An example room name could be: `Keith Burrows Theatre (K-J14-G5)`
Start or end date would follow the format: `YYYY-MM-DD`. For now it can be assumed that the starting day will always be a _Monday_, and the ending date will always be a _Sunday_.

Desired output follows format:
```
[
    {
        "start": "YYYY-MM-DD hh"
        "end": "YYYY-MM-DD hh"
    }
]
```
A course name for each date pair is also beneficial, but not necessary yet.

