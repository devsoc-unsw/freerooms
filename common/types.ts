// Contains types shared across BE/FE/App
import { z } from "zod";

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

export type AverageRating = {
  cleanliness: number;
  location: number;
  quietness: number;
}

///////////////////////////////////////////////////////////////
// API Response Types

const buildingSchema = z.object({
  name: z.string(),
  id: z.string(),
  lat: z.number(),
  long: z.number(),
  aliases: z.array(z.string()),
});

const roomSchema = z.object({
  name: z.string(),
  id: z.string(),
  abbr: z.string(),
  capacity: z.number(),
  usage: z.string(),
  school: z.string(),
});

const roomStatusSchema = z.object({
  status: z.enum(["free", "soon", "busy"]),
  endtime: z.string(),
});

const buildingStatusSchema = z.object({
  numAvailable: z.number(),
  roomStatuses: z.record(z.string(), roomStatusSchema),
});

const bookingSchema = z.object({
  name: z.string(),
  bookingType: z.string(),
  start: z.date(),
  end: z.date(),
});

export const buildingsResponseSchema = z.object({
  buildings: z.array(buildingSchema),
});

export type BuildingsResponse = z.infer<typeof buildingsResponseSchema>;

export const roomsResponseSchema = z.object({
  rooms: z.record(z.string(), roomSchema),
});

export type RoomsResponse = z.infer<typeof roomsResponseSchema>;

export const statusResponseSchema = z.record(
  z.string(),
  buildingStatusSchema
);

export type StatusResponse = z.infer<typeof statusResponseSchema>;

export const searchResponseValueSchema = roomStatusSchema.extend({
  name: z.string(),
});

export type SearchResponseValue = z.infer<typeof searchResponseValueSchema>;

export const searchResponseSchema = z.record(
  z.string(),
  searchResponseValueSchema
);

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const bookingsResponseSchema = z.object({
  bookings: z.array(bookingSchema),
});

export type BookingsResponse = z.infer<typeof bookingsResponseSchema>;


// how ratings are stored in Mongo
export type RawRatingDocument = { 
  roomId: string, 
  ratings: Rating[] 
}

const averageRatingSchema = z.object({
  cleanliness: z.number(),
  location: z.number(),
  quietness: z.number(),
});

export const ratingsResponseSchema = z.object({
  // roomId refers to room name
  roomId: z.string(),
  overallRating: z.number(),
  averageRating: averageRatingSchema,
});

export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;

export const buildingRatingsResponseSchema = z.object({
  buildingId: z.string(),
  overallRating: z.number(),
});

export type BuildingRatingsResponse = z.infer<
  typeof buildingRatingsResponseSchema
>;

export const roomUtilitiesResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  floor: z.string().nullable(),
  seating: z.string().nullable(),
  microphone: z.array(z.string()),
  accessibility: z.array(z.string()),
  audiovisual: z.array(z.string()),
  infotechnology: z.array(z.string()),
  writingMedia: z.array(z.string()),
  service: z.array(z.string()),
});

export type RoomUtilitiesResponse = z.infer<typeof roomUtilitiesResponseSchema>;