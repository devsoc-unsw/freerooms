import Buildings from "../models/Buildings";

export default class LocationService {
  getBuildingByID(id: number): string {
    return Buildings[id];
  }

  getAllBuildings(): string[] {
    return Object.keys(Buildings).filter(
      (key) => !isNaN(Number(Buildings[key]))
    );
  }
}
