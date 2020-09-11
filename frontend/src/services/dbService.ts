// Class to handle Frontend Requests to backend for data from mongodb database.
import moment from 'moment';

export default class DbService {
    // TODO: Add the calls to backend in these functions.
    // Get an array of objects of all rooms within a building.
    getRoomsInBuilding (buildingName: string, hour: string): { name: string; available: boolean }[] {
        // Fake data set.
        const rooms = [
            {
                "Keith Burrows Theatre (K-J14-G05)": [
                    {    
                    "start": "2020-09-11 11",
                    "end": "2020-09-11 12"
                    },
                    {    
                    "start": "2020-09-11 9",
                    "end": "2020-09-11 10"
                    },
                    {    
                    "start": "2020-09-11 14",
                    "end": "2020-09-11 15"
                    },
                    {    
                    "start": "2020-09-11 17",
                    "end": "2020-09-11 19"
                    },
                ],
            },
            {
                "Keith Burrows Theatre (K-J14-105)": [
                    {    
                    "start": "2020-09-11 11",
                    "end": "2020-09-11 12"
                    },
                    {    
                    "start": "2020-09-11 2",
                    "end": "2020-09-11 10"
                    }
                ],
            },
            {
                "Keith Burrows Theatre (K-J14-205)": [
                    {    
                    "start": "2020-09-11 9",
                    "end": "2020-09-11 10"
                    }
                ],
            },
            {
                "Keith Burrows Theatre (K-J14-207)": [
                    {    
                    "start": "2020-09-11 11",
                    "end": "2020-09-11 12"
                    }
                ],
            }
        ];

        const result: any = [];
        for (const room of rooms) {
            const curResult = {}
            const splitName = Object.keys(room)[0].split("-");
            curResult['name'] = splitName[splitName.length-1].split(")")[0];
            curResult['available'] = this.checkAvailable(room[Object.keys(room)[0]], hour);
            result.push(curResult);
        }
        return result;
    }

    checkAvailable(bookings: any[], hour: string) {
        for (const timePair of bookings) {
            const startHour = timePair['start'].split(' ')[1];
            const endHour = timePair['end'].split(' ')[1];
            if (+startHour <= +hour && +hour < +endHour)
                return false;
        }
        return true;
    }

    // Returns a list of objects containing the start and end time of each event.
    getRoomBookingsInTimeRange (room: string, startTime: string, endTime: string) {
        const startTimeGen = moment();
        const endTimeGen = startTimeGen.clone().add(1, 'd');
        return [{start: startTimeGen.format('YYYY-MM-DD hh:mm'),
                 end: endTimeGen.format('YYYY-MM-DD hh:mm')}
               ];
    }

    // Currently unused. //
    // Given a specific time, returns true if the given room is available,
    // false otherwise.
    getRoomAvailableAtTime (room: string, timeString: string): boolean {
        return true;
    }
}