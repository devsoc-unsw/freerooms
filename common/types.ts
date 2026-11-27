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

// Booking Pagination

// One query param per filter, each with a single value, like the browse page
export const bookingFilterSchema = z.object({
  startTime: z.date().optional(), // bookings starting at or after it
  endTime: z.date().optional(),
  bookingType: z.array(z.enum(BookingType)).optional(),
  plannedSize: z.number().optional(), // minimum planned size, same as room capacity
  location: z.array(z.enum(["upper", "lower"])).optional(),
});

export type BookingFilter = z.infer<typeof bookingFilterSchema>;

export const bookingSorts = [
  "ascendingStart",           // start time earliest
  "descendingStart",          // start time last
  "alphabetical",             // booking name A-Z
  "reverseAlphabetical",      // booking name Z-A
  "plannedSize",              // largest planned size first
  "remainingTime",            // least time remaining (end - now) first
] as const;

export const bookingSortSchema = z.enum(bookingSorts);

export type BookingSort = z.infer<typeof bookingSortSchema>;

export const bookingCursorSchema = z.object({
  start: z.date(),
  end: z.date(),
  name: z.string(),
  plannedSize: z.number().nullable(),
  bookingType: z.enum(BookingType),
  roomId: z.string(),
  occurrenceId: z.string(),
  filter: bookingFilterSchema.nullable(),
  sort: bookingSortSchema.nullable(),
  search: z.string().nullable(),
});

export type BookingCursor = z.infer<typeof bookingCursorSchema>;

export const bookingPaginationParamsSchema = z.object({
  limit: z.number(),
  filters: bookingFilterSchema.nullable(),
  sort: bookingSortSchema,
  search: z.string().nullable(),
  cursor: bookingCursorSchema.nullable(),
});

export type BookingPaginationParams = z.infer<
  typeof bookingPaginationParamsSchema
>;

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
  roomId: z.string().optional(),
  occurrenceId: z.string().optional(),
  eventId: z.string().nullish(),
  name: z.string(),
  bookingType: z.string(),
  start: z.date(),
  end: z.date(),
  plannedSize: z.number().nullish(),
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


// Metadata associated with a booking
export const bookingListModuleSchema = z.object({
  code: z.string().nullish(),
  name: z.string().nullish(),
  term: z.string().nullish(),
  career: z.string().nullish(),
});

export type BookingListModule = z.infer<typeof bookingListModuleSchema>;

// Booking with identifiers for nav
export const bookingSummarySchema = bookingSchema.extend({
  roomId: z.string(),
  occurrenceId: z.string(),
});

export type BookingSummary = z.infer<typeof bookingSummarySchema>;

// Booking with the asscoiated module information
export const bookingDetailsSchema = bookingSummarySchema.extend({
  bookingModules: z.array(bookingListModuleSchema),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;


//  Bookings for a specific event
export const bookingsEventResponseSchema = bookingSummarySchema.extend({
  eventId: z.string(),
});

export type BookingsEventResponse = z.infer<typeof bookingsEventResponseSchema>;


export const paginatedBookingSchema = bookingDetailsSchema;

export type PaginatedBooking = z.infer<typeof paginatedBookingSchema>;

// Bookings Pagination Response
export const bookingsPaginationResponseSchema = z.object({
  bookings: z.array(paginatedBookingSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
});

export type BookingsPaginationResponse = z.infer<
  typeof bookingsPaginationResponseSchema
>;

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

///////////////////////////////////////////////////////////////
// API Request Types

export const roomIdParamsSchema = z.object({
  roomID: z.string().min(1),
});

export const buildingIdParamsSchema = z.object({
  buildingID: z.string().min(1),
});

export const ratingParamsSchema = z.object({
  buildingID: z.string().min(1),
  roomID: z.string().min(1),
});

export const roomUtilitiesParamsSchema = z.object({
  roomId: z.string().min(1),
});

export const bookingsEventParamsSchema = z.object({
  eventID: z.string().min(1),
});

export const bookingDetailsParamsSchema = z.object({
  roomID: z.string().min(1),
  occurrenceID: z.string().min(1),
});

export const bookingsPaginationQuerySchema = z.object({
  limit: z.string().optional(),
  bookingType: z.string().optional().describe("Comma-Separated booking types"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  plannedSize: z.string().optional(),
  location: z.string().optional().describe("Comma-Separated campus locations: upper, lower"),
  sort: z.string().optional(),
  search: z.string().optional(),
  cursor: z.string().optional(),
});

export const statusQuerySchema = z.object({
  datetime: z.string().optional(),
  capacity: z.string().optional(),
  usage: z.string().optional().describe("Comma-Separated room usage codes"),
  location: z.string().optional().describe("Comma-Separated campus locations: upper, lower"),
  duration: z.string().optional(),
  recurring: z.string().optional(),
  id: z.string().optional().describe("Comma-Separated ID requirements: true, false"),
});

export const searchQuerySchema = statusQuerySchema.extend({
  buildingId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const ratingCreatedResponseSchema = z.object({
  message: z.string(),
});
