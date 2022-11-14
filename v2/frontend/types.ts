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

export type DropDown = {
  text: string,
  value: string
  items: DropDownItem[]
};

export type DropDownItem = {
  text: string,
  value: string,
};

export type Filters = {
  capacity?: string,
  usage?: string;
  location?: string;
  duration?: string;
}

export type RoomsRequestParams = {
  datetime?: string,
  capacity?: string,
  usage?: string,
  location?: string,
  duration?: string
}
