# Freerooms

A web application designed to aid UNSW students in finding vacant rooms.

## Running on your local machine

### Frontend

##### Project setup

```
npm install
```

##### Compiles and hot-reloads for development

```
npm run serve
```

##### Compiles and minifies for production

```
npm run build
```

### Backend

```
npm start
```

## data.json

The json object `data.json` is currently organised as follows (subject to change):

`Term` refers to any element from `['U1', 'T1', 'T2', 'T3']` (all will exist as of time of writing)  
`BuildingID` refers to building code such as `K-J17`  
`RoomID` refers to room code such as `101` or `G01`  
`RoomName` refers to the room name such as `Ainsworth 101` or `Ainsworth G01`  
`Week` refers to text such as `['0', '1', '2', ... '15']` (change as necessary)  
`Day` refers to any element from `['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`  
`CourseCodeText` refers to course code such as `COMP1511`  
`Time_Text` refers to text formatted as `YYYY-MM-DD hh:mm` such as `2020-9-12 14:00`

```json
{
  "Term": {
    "BuildingID": {
      "RoomID": {
        "name": "RoomName",
        "Week": {
          "Day": [
            {
              "courseCode": "courseCodeText",
              "start": "Time_Text",
              "end": "Time_Text"
            }
          ]
        }
      }
    }
  }
}
```
