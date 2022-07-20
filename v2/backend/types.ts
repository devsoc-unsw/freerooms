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

export type RoomStatus = "free" | "soon" | "busy";

export type BuildingRoomStatus = {
  [roomId: string]: {
    status: RoomStatus;
    endtime: string;
  };
};

export type BuildingReturnData = {
  name: string;
  id: string;
  img: string;
};



