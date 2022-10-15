export type ScraperData = {
  [buildingId: string]: {
    [roomId: string]: RoomAvailability;
  };
};

export type RoomAvailability = {
  name: string;
  [week: number]: {
    [day: string]: ClassList;
  };
};

export type ClassList = Class[];

export type Class = {
  courseCode: string;
  start: string;
  end: string;
};

export type BuildingDatabase = {
  [buildingId: string]: BuildingData;
};

export type BuildingData = {
  name: string;
  id: string;
  lat: number;
  long: number;
  rooms: {
    [roomNumber: string]: RoomData;
  };
};

export type RoomUsage = "LEC" | "TUT";

export type RoomData = {
  name: string;
  id: string;
  capacity: number;
  usage: RoomUsage;
};

export type ScrapeResult<T extends RoomData | BuildingData> = T | undefined;

export type Status = "free" | "soon" | "busy";

export type RoomStatus = {
  status: Status;
  endtime: string;
};

export type BuildingStatus = {
  [roomId: string]: RoomStatus;
};

export type RoomsReturnData = {
  [buildingId: string]: BuildingStatus;
};

export type BuildingsReturnData = {
  name: string;
  id: string;
  lat: number;
  long: number;
};

export type Location = "upper" | "lower";

export type Filters = {
  capacity?: number,
  usage?: RoomUsage;
  location?: Location;
  duration?: number;
}

