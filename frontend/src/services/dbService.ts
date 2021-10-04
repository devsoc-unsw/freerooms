// Class to handle Frontend Requests to backend for data from mongodb database.
import { Booking, BuildingData, Campus, Room } from "@/types";
import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";

// Handle error on request to backend.
const handleError = (fn: Function) => (...params: any) =>
  fn(...params).catch((error: AxiosError) => {
    if (error.response) {
      console.log(
        `${error.response.status}: ${error.response.statusText}`,
        error.response.data
      );
    } else {
      console.log(`Error: ${error.message}`);
    }
  });

// Api to call the backend.
const api = {
  // Get a list of all buildings
  getAllBuildings: async () => {
    const url = `/buildings`;
    const res = await axios.get(url);
    return res.data;
  },
  // Get a list of all rooms in a building.
  getRoomsInBuilding: handleError(async (location: string, date?: string) => {
    const url = `/buildings/${location}`;
    const qs = { params: { datetime: date } };
    const res = await axios.get(url, qs);
    return res.data;
  }),

  // Get a list of all booked periods in the room for a given date.
  getRoomBookings: handleError(async (location: string, room: string) => {
    const url = `/buildings/${location}/${room}`;
    const res = await axios.get(url);
    return res.data;
  }),
};

export default class DbService {
  // By default, gets all the buildings from both campuses, otherwise gets all the buildings from the specified campus
  // return sorted array of building data
  async getAllBuildings(campus?: Campus) {
    const data = await api.getAllBuildings();
    if (!data) {
      console.error("Could not get all buildings", campus);
      return [];
    }

    let buildings: BuildingData[] = data.buildings;

    // Sort build names alphabetically
    buildings.sort((a: BuildingData, b: BuildingData) =>
      a.name > b.name ? 1 : -1
    );

    if (!campus) return buildings;

    if (campus === "Kensington") {
      buildings = buildings.filter((data) => data.id.startsWith("K-"));
    } else {
      buildings = buildings.filter((data) => data.id.startsWith("P-"));
    }

    return buildings;
  }

  async getBuildingByLocation(location: string) {
    const data = await api.getAllBuildings();

    if (!data) {
      console.error(`Could not get building with location ${location}`);
      return [];
    }

    const building = data.buildings.find(
      (data: BuildingData) => data.id === location
    );

    return building.name;
  }

  // Get an array of objects of all rooms within a building.
  async getRoomsInBuilding(building: string, date?: string) {
    const data = await api.getRoomsInBuilding(building, date);

    if (!data) {
      console.error(`Could not get all the rooms from building ${building}`);
      return [];
    }

    const rooms = data.rooms;
    const result: Room[] = [];

    for (const room in rooms) {
      const roomInfo = rooms[room];
      const data = {
        name: room,
        classEndTime: roomInfo.endtime,
        status: roomInfo.status,
      };

      result.push(data);
    }

    return result;
  }

  // Returns a list of objects containing the start and end time of each event.
  async getRoomBookingsInTimeRange(
    location: string,
    room: string,
    startTime: string,
    endTime: string
  ) {
    // Gets all the room bookings from start time
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = await api.getRoomBookings(location, room, startTime);

    if (!data) {
      console.error(`Could not get bookings for room ${room}`, {
        room,
        startTime,
      });
      return [];
    }

    const startDate = new Date(startTime);
    startDate.setHours(0);

    const endDate = new Date(endTime);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    const result: Booking[] = [];
    const times: number[] = [];

    for (const week in data) {
      if (week === "name") continue;
      const weekData = data[week];

      for (const day in weekData) {
        const dayData = data[week][day];

        for (const booking of dayData) {
          if (!booking["start"] || !booking["end"]) continue;

          const currentDay = startDate.getDate() + days.indexOf(day);
          const hoursStart =
            startDate.getHours() + parseInt(booking["start"].split(":")[0]);
          const hoursEnd =
            startDate.getHours() + parseInt(booking["end"].split(":")[0]);

          const bookingStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            currentDay,
            hoursStart,
            0,
            0
          );
          const bookingEndDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            currentDay,
            hoursEnd,
            0,
            0
          );

          const bookingEdit = booking;
          bookingEdit["start"] = DateTime.fromJSDate(bookingStartDate).toFormat(
            "yyyy-MM-dd HH:mm"
          );
          bookingEdit["end"] = DateTime.fromJSDate(bookingEndDate).toFormat(
            "yyyy-MM-dd HH:mm"
          );

          if (bookingStartDate >= startDate && bookingEndDate <= endDate) {
            if (!times.includes(bookingStartDate.getTime())) {
              result.push(bookingEdit);
            }
            times.push(bookingStartDate.getTime());
          }
        }
      }
    }
    return result;
  }
}
