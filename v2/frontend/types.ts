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

export type Room = {
  name: string;
  classes: Week;
};

export type Building = Record<string, Room>;

export type TimetableData = Record<string, Building>;

export type RoomStatus = "free" | "soon" | "busy";

export type BuildingRoomStatusDetails = {
  status: RoomStatus;
  endtime: string;
};

export type BuildingRoomReturnStatus = {
  rooms: {
    [roomId: string]: BuildingRoomStatusDetails;
  };
};

export type BuildingRoomStatus = {
  [roomId: string]: BuildingRoomStatusDetails;
};

export type BuildingData = {
  name: string;
  id: string;
  img: string;
};

export type BuildingReturnData = {
  buildings: BuildingData[];
};

export type RoomAvailability = {
  roomName: string;
  [week: number]: {
    [day: string]: ClassList;
  };
};