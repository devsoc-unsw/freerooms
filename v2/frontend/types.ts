// copied over from backend

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

export type Building = {
  name: string;
  id: string;
  lat: number;
  long: number;
};

export type BuildingReturnData = {
  buildings: Building[]
}

export type RoomUsage = "LEC" | "TUT";

export type Location = "upper" | "lower";

export type Filters = {
  capacity: number,
  usage: RoomUsage | null;
  location: Location | null;
  duration: number;
}

export type RoomsRequestParams = {
  datetime?: string,
  capacity?: number,
  usage?: string,
  location?: string,
  duration?: number
}
