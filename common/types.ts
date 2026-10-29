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

export enum BookingType {
  "LECTURE" = "LECTURE", 
  "TUTORIAL" = "TUTORIAL",
  "LABORATORY" = "LABORATORY",
  "TUTORIAL_LABORATORY" = "TUTORIAL_LABORATORY",
  "WORKSHOP" = "WORKSHOP",
  "SEMINAR" = "SEMINAR",
  "STUDIO" = "STUDIO",
  "CLASS" = "CLASS",
  "EXAMS" = "EXAMS",
  "SOCIETY" = "SOCIETY",
  "INTERNAL" = "INTERNAL",
  "BLOCK" = "BLOCK",
  "MISC" = "MISC",
  "OTHER" = "OTHER",
}

export type Booking = {
  roomId?: string;
  occurrenceId?: string;
  name: string;
  bookingType: string;
  start: Date;
  end: Date;
  plannedSize?: number;
};

export type BookingModule = {
  term: string;
  career: string;
  code: string;
  name: string;
};

// Booking Pagination
export type BookingCursor = {
  start: Date;
  bookingType: BookingType;
  roomId: string;
  occurrenceId: string;
  filter: string[];
  sort: string[];
  search: string | null;
};

export type BookingPaginationParams = {
  limit: number;
  cursor: BookingCursor | null;
  filters: string[];
  sort: string[];
  search: string | null;
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

export type AverageRating = {
  cleanliness: number;
  location: number;
  quietness: number;
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

// Bookings for a specific event occurrence
export type BookingsEventResponse = {
  eventId: string;
  occurrenceId: string;
  roomId: string;
  name: string;
  bookingType: string;
  plannedSize: string;
  start: Date;
  end: Date;
};

// Bookings module for a specific occurrence
export type BookingsModuleResponse = {
  occurrenceId: string;
  roomId: string;
  bookingModule: BookingModule;
};

// Bookings Pagination Response
export type BookingsPaginationResponse = {
  bookings: Booking[];
  nextCursor: string | null;
  hasMore: boolean;
};

// how ratings are stored in Mongo
export type RawRatingDocument = {
  roomId: string;
  ratings: Rating[];
};

export type RatingsResponse = {
  // roomId refers to room name
  roomId: string;
  overallRating: number;
  averageRating: AverageRating;
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
