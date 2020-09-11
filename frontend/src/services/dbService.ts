// Class to handle Frontend Requests to backend for data from mongodb database.
import axios from 'axios';

const baseURL = 'http://localhost:1337/';

// Handle error on request to backend.
const handleError = fn => (...params) =>
  fn(...params).catch(error => {
    console.log(`${error.response.status}: ${error.response.statusText}`, 'error');
  });

const api = {
    getRoomsInBuilding: handleError(async (buildingName: string, date: string) => {
      const res = await axios.get(baseURL + "buildings/"
                                    + buildingName + "/"
                                    + date);
      return res.data;
    }),
    getRoomBookingsInTimeRange: handleError(async (roomName: string, startDate: string, endDate: string) => {
      const res = await axios.get(baseURL + "buildings/"
                                    + roomName + "/"
                                    + startDate + "/"
                                    + endDate);
      return res.data;
    })
  };

export default class DbService {
    // TODO: Add the calls to backend in these functions.
    // Get an array of objects of all rooms within a building.
   async getRoomsInBuilding (buildingName: string, hour: string) {
        const data = await api.getRoomsInBuilding(buildingName);
        console.log("a"+ data);

        // Format results.
        const result: any = [];
        for (const room of data) {
            const curResult = {}
            const splitName = Object.keys(room)[0].split("-");
            curResult['name'] = splitName[splitName.length-1].split(")")[0];
            curResult['available'] = this.checkAvailable(room[Object.keys(room)[0]], hour);
            result.push(curResult);
        }
        return result;
    }

    // Check if a room is available at the given hour.
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
    async getRoomBookingsInTimeRange (room: string, startTime: string, endTime: string) {
        const data = await api.getRoomBookingsInTimeRange(room, startTime, endTime);

        return data;
    }

    // Currently unused. //
    // Given a specific time, returns true if the given room is available,
    // false otherwise.
    getRoomAvailableAtTime (room: string, timeString: string): boolean {
        return true;
    }
}