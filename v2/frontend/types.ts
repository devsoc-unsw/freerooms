// copied over from backend

export type ScraperData = {
  termStart: string;
} & ScraperBuildingData;

export type ScraperBuildingData = {
  [buildingId: string]: {
    [roomId: string]: {
      roomName: string;
      [week: number]: {
        [day: string]: ClassList;
      };
    };
  };
};

export type Class = {
  courseCode: string;
  start: string;
  end: string;
};

export type ClassList = Class[];

export type Day = Record<string, ClassList>;

export type Week = Record<string, Day>;

export type RoomClasses = {
  name: string;
  classes: Week;
};

// export type Building = Record<string, Room>;

export type TimetableData = Record<string, Building>;

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
  img: string;
};

export type BuildingReturnData = {
  buildings: Building[];
};

export type RoomAvailability = {
  roomName: string;
  [week: number]: {
    [day: string]: ClassList;
  };
};

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

