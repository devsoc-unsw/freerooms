// Contains types shared across BE/FE/App
import { z } from "zod";

///////////////////////////////////////////////////////////////
// Data types
export const buildingSchema = z.object({
  name: z.string(),
  id: z.string(),
  lat: z.number(),
  long: z.number(),
  aliases: z.array(z.string()),
});

export type Building = z.infer<typeof buildingSchema>;

export const roomSchema = z.object({
  name: z.string(),
  id: z.string(),
  abbr: z.string(),
  capacity: z.number(),
  usage: z.string(),
  school: z.string(),
});

export type Room = z.infer<typeof roomSchema>;

export const bookingSchema = z.object({
  name: z.string(),
  bookingType: z.string(),
  start: z.date(),
  end: z.date(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const roomStatusSchema = z.object({
  status: z.enum(["free", "soon", "busy"]),
  endtime: z.string(),
});

export type RoomStatus = z.infer<typeof roomStatusSchema>;

export const roomStatusesSchema = z.record(z.string(), roomStatusSchema);

export type RoomStatuses = z.infer<typeof roomStatusesSchema>;

export const buildingStatusSchema = z.object({
  numAvailable: z.number(),
  roomStatuses: roomStatusesSchema,
});

export type BuildingStatus = z.infer<typeof buildingStatusSchema>;

export const schoolSchema = z.object({
  name: z.string(),
  homepage: z.string(),
  contactLink: z.string(),
});

export type School = z.infer<typeof schoolSchema>;

export const ratingSchema = z.object({
  cleanliness: z.number(),
  location: z.number(),
  quietness: z.number(),
  overall: z.number(),
});

export type Rating = z.infer<typeof ratingSchema>;

export const averageRatingSchema = z.object({
  cleanliness: z.number(),
  location: z.number(),
  quietness: z.number(),
});

export type AverageRating = z.infer<typeof averageRatingSchema>;

///////////////////////////////////////////////////////////////
// API Response Types

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
export const rawRatingDocumentSchema = z.object({
  roomId: z.string(),
  ratings: z.array(ratingSchema),
});

export type RawRatingDocument = z.infer<typeof rawRatingDocumentSchema>;

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