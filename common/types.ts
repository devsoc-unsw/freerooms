// Contains types shared across BE/FE/App

///////////////////////////////////////////////////////////////
// Data types

export type Building = {
  name: string;
  id: string;
  lat: number;
  long: number;
  aliases: string[];
};

export type Room = {
  name: string;
  id: string;
  abbr: string;
  capacity: number;
  usage: string;
  school: string;
};

export type Booking = {
  name: string;
  bookingType: string;
  start: Date;
  end: Date;
};

export type BuildingStatus = {
  [roomNumber: string]: RoomStatus
}

export type RoomStatus = {
  status: "free" | "soon" | "busy";
  endtime: string;
};

export type School = {
    name : string;
    homepage : string;
    contactLink : string
}

export type Schools = {
  [ schoolCode : string ] : School
}

///////////////////////////////////////////////////////////////
// API Response Types

export type BuildingsResponse = {
  buildings: Building[];
}

export type RoomsResponse = {
  rooms: {
    [roomId: string]: Room
  };
}

export type StatusResponse = {
  [buildingId: string]: BuildingStatus
}

export type BookingsResponse = {
  bookings: Booking[];
};
