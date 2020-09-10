// Frontend Requests to mongodb database

export default class DbService {
    // TODO: Implement these functions
    // Get an array of objects of all rooms within a building.
    getRoomsInBuilding (buildingRegex: string) {
        return [{name: "101", available: true}, {name: "103", available: false}, {name: "205", available: true}, {name: "209", available: true}, {name: "305", available: true}, {name: "306", available: false}];
    }

    // Returns a list of objects containing the start and end time of each event.
    getRoomBookingsInTimeRange (room: string, startTime: Date, endTime: Date) {
        return [{start: new Date(), end: new Date()}];
    }

    // Currently unused. //
    // Given a specific time, returns true if the given room is available,
    // false otherwise.
    getRoomAvailableAtTime (room: string, timeString: string): boolean {
        return true;
    }
}