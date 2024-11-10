import { Building, Room } from "@common/types";

export type BuildingDatabase = {
  [buildingId: string]: Building & {
    rooms: {
      [roomNumber: string]: Room;
    };
  };
};

export type StatusFilters = {
  capacity?: number;
  usage?: string;
  location?: "upper" | "lower";
  duration?: number;
  id?: boolean;
};

export type SearchFilters = StatusFilters & {
  buildingId?: string;
  startTime: Date;
  endTime?: Date;
};
