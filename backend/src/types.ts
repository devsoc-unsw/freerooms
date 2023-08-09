import { Building, Room } from "@common/types";

export type TimetableData = {
  [buildingId: string]: {
    [roomId: string]: {
      name: string;
      [week: number]: {
        [day: string]: Class[];
      };
    };
  };
};

export type Class = {
  courseCode: string;
  start: string;
  end: string;
};

export type BuildingDatabase = {
  [buildingId: string]: Building & {
    rooms: {
      [roomNumber: string]: Room;
    };
  };
};

export type Filters = {
  capacity?: number,
  usage?: string;
  location?: "upper" | "lower";
  duration?: number;
}

export type LocationOverrideData = {
  buildings: Array<{
    name: string;
    id: string;
    lat: number;
    long: number;
  }>;
}
