export type TimetableData = {
  [buildingId: string]: {
    [roomId: string]: RoomBookings;
  };
};

export type RoomBookings = {
  name: string;
  [week: number]: {
    [day: string]: Class[];
  };
};

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

export type RoomData = {
  name: string;
  id: string;
  capacity: number;
  usage: RoomUsage;
};

export type RoomUsage = "LEC" | "TUT";

export type RoomsResponse = {
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

export type Location = "upper" | "lower";

export type Filters = {
  capacity?: number,
  usage?: RoomUsage;
  location?: Location;
  duration?: number;
}

export type LocationData = {
  buildings: Array<{
    name: string;
    id: string;
    lat: number;
    long: number;
  }>;
}

export type RoomBooking = {
  bookingType: string;
  name: string;
  roomId: string;
  start: Date;
  end: Date;
}

export type Room = {
  abbr: string;
  name: string;
  id: string;
  usage: string;
  capacity: number;
  school: string;
}