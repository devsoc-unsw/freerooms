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
export const roomSchema = z.object({
    name: z.string(),
    id: z.string(),
    abbr: z.string(),
    capacity: z.number(),
    usage: z.string(),
    school: z.string(),
});
export const bookingSchema = z.object({
    name: z.string(),
    bookingType: z.string(),
    start: z.date(),
    end: z.date(),
});
export const roomStatusSchema = z.object({
    status: z.enum(["free", "soon", "busy"]),
    endtime: z.string(),
});
export const roomStatusesSchema = z.record(z.string(), roomStatusSchema);
export const buildingStatusSchema = z.object({
    numAvailable: z.number(),
    roomStatuses: roomStatusesSchema,
});
export const schoolSchema = z.object({
    name: z.string(),
    homepage: z.string(),
    contactLink: z.string(),
});
export const ratingSchema = z.object({
    cleanliness: z.number(),
    location: z.number(),
    quietness: z.number(),
    overall: z.number(),
});
export const averageRatingSchema = z.object({
    cleanliness: z.number(),
    location: z.number(),
    quietness: z.number(),
});
///////////////////////////////////////////////////////////////
// API Response Types
export const buildingsResponseSchema = z.object({
    buildings: z.array(buildingSchema),
});
export const roomsResponseSchema = z.object({
    rooms: z.record(z.string(), roomSchema),
});
export const statusResponseSchema = z.record(z.string(), buildingStatusSchema);
export const searchResponseValueSchema = roomStatusSchema.extend({
    name: z.string(),
});
export const searchResponseSchema = z.record(z.string(), searchResponseValueSchema);
export const bookingsResponseSchema = z.object({
    bookings: z.array(bookingSchema),
});
// how ratings are stored in Mongo
export const rawRatingDocumentSchema = z.object({
    roomId: z.string(),
    ratings: z.array(ratingSchema),
});
export const ratingsResponseSchema = z.object({
    // roomId refers to room name
    roomId: z.string(),
    overallRating: z.number(),
    averageRating: averageRatingSchema,
});
export const buildingRatingsResponseSchema = z.object({
    buildingId: z.string(),
    overallRating: z.number(),
});
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
export const statusQuerySchema = z.object({
    datetime: z.string().optional(),
    capacity: z.string().optional(),
    usage: z.string().optional(),
    location: z.enum(["upper", "lower"]).optional(),
    duration: z.string().optional(),
    recurring: z.string().optional(),
    id: z.enum(["true", "false"]).optional(),
});
export const searchQuerySchema = statusQuerySchema.extend({
    buildingId: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});
export const ratingCreatedResponseSchema = z.object({
    message: z.string(),
});
