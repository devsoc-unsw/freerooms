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

export type RoomStatuses = {
  [roomNumber: string]: RoomStatus;
};

export type BuildingStatus = {
  numAvailable: number;
  roomStatuses: RoomStatuses;
};

export type RoomStatus = {
  status: "free" | "soon" | "busy";
  endtime: string;
};

export type School = {
  name: string;
  homepage: string;
  contactLink: string;
};

export type Rating = {
  cleanliness: number;
  location: number;
  quietness: number;
  overall: number;
};

///////////////////////////////////////////////////////////////
// API Response Types

export type BuildingsResponse = {
  buildings: Building[];
};

export type RoomsResponse = {
  rooms: {
    [roomId: string]: Room;
  };
};

export type StatusResponse = {
  [buildingId: string]: BuildingStatus;
};

export type SearchResponseValue = RoomStatus & Pick<Room, "name">;

export type SearchResponse = {
  [roomId: string]: SearchResponseValue;
};

export type BookingsResponse = {
  bookings: Booking[];
};

export type RatingsResponse = {
  // roomId refers to room name
  roomId: string;
  overallRating: number;
  ratings: Rating[];
};

export type BuildingRatingsResponse = {
  buildingId: string;
  overallRating: number;
};

export type RoomUtilitiesResponse = {
  id: string;
  name: string;
  floor: string | null;
  seating: string | null;
  microphone: string[];
  accessibility: string[];
  audiovisual: string[];
  infotechnology: string[];
  writingMedia: string[];
  service: string[];
};