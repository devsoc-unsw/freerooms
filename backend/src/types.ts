import { Building, Room } from "@common/types";

export type BuildingDatabase = {
  [buildingId: string]: Building & {
    rooms: {
      [roomNumber: string]: Room;
    };
  };
};

export type RoomData = {
  name: string;
  id: string;
  capacity: number;
  usage: RoomUsage;
};

export type RoomUsage = "LEC" | "TUT";

export type StatusResponse = {
  [buildingId: string]: BuildingStatus;
};

export type BuildingStatus = {
  [roomId: string]: RoomStatus;
};

export type RoomStatus = {
  status: "free" | "soon" | "busy";
  endtime: string;
};

export type BuildingsResponse = Array<{
  name: string;
  id: string;
  lat: number;
  long: number;
}>;

export type RoomsResponse = {
  [roomId: string]: RoomData;
};

export type Location = "upper" | "lower";

export type Filters = {
  capacity?: number;
  usage?: string;
  location?: "upper" | "lower";
  duration?: number;
  id?: boolean;
};
