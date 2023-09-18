import { Building, Room } from "@common/types";

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
