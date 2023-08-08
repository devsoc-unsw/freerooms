import { Building, Room } from "@common/types";

<<<<<<< HEAD
///////////////////////////////////////////////////////////////
// Dropdown types
=======
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

export type RoomUsage = "LEC" | "TUT";

export type RoomData = {
  name: string;
  id: string;
  capacity: number;
  usage: RoomUsage;
};

export type RoomsResponse = {
  [roomId: string]: RoomData
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
>>>>>>> a27b7d9 (feat(backend): create and adopt `/api/rooms` endpoint for room data (#401))

export type DropDown = {
  text: string,
  key: keyof Filters,
  items: DropDownItem[]
};

export type DropDownItem = {
  text: string,
  value: string,
};

///////////////////////////////////////////////////////////////
// Search options for site-wide search

export type SearchOption = (BuildingSearchOption | RoomSearchOption) & {
  recent?: boolean;
};

// First element in searchKeys should always be name
export type BuildingSearchOption = {
  type: "Building";
  searchKeys: string[];
  building: Building;
};

export type RoomSearchOption = {
  type: "Room";
  searchKeys: string[];
  room: Room;
};

///////////////////////////////////////////////////////////////
// Other

// Filters for /rooms endpoint
export type Filters = {
  capacity?: string,
  usage?: string;
  location?: string;
  duration?: string;
  id?: string;
}
