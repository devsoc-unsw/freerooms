# Requests to backend from frontend

Bookings for a building/room are retrieved as follows:  

## For a specific building
Input type: array of all rooms in a specified building, with their booked times for a specified date.  
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
A course name for each date pair is also beneficial, but not necessary yet.  

## For a specific room in a building
An example room_name could be: `Keith Burrows Theatre (K-J14-G5)`  

Input type: room name, a starting date and an ending date.
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
