import Locations from "../models/enum";

export default class LocationService {
  getRoomById(id: number): string {
    return `Room ${id}`;
  }

  getLocationbyId(id: number): string {
    return Locations[id];
  }

  getAllLocations(): string[] {
    return Object.keys(Locations).filter(key => !isNaN(Number(Locations[key])));
  }
}
