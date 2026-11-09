"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingCreatedResponseSchema = exports.searchQuerySchema = exports.statusQuerySchema = exports.roomUtilitiesParamsSchema = exports.ratingParamsSchema = exports.buildingIdParamsSchema = exports.roomIdParamsSchema = exports.roomUtilitiesResponseSchema = exports.buildingRatingsResponseSchema = exports.ratingsResponseSchema = exports.rawRatingDocumentSchema = exports.bookingsResponseSchema = exports.searchResponseSchema = exports.searchResponseValueSchema = exports.statusResponseSchema = exports.roomsResponseSchema = exports.buildingsResponseSchema = exports.averageRatingSchema = exports.ratingSchema = exports.schoolSchema = exports.buildingStatusSchema = exports.roomStatusesSchema = exports.roomStatusSchema = exports.bookingSchema = exports.roomSchema = exports.buildingSchema = void 0;
// Contains types shared across BE/FE/App
const zod_1 = require("zod");
///////////////////////////////////////////////////////////////
// Data types
exports.buildingSchema = zod_1.z.object({
    name: zod_1.z.string(),
    id: zod_1.z.string(),
    lat: zod_1.z.number(),
    long: zod_1.z.number(),
    aliases: zod_1.z.array(zod_1.z.string()),
});
exports.roomSchema = zod_1.z.object({
    name: zod_1.z.string(),
    id: zod_1.z.string(),
    abbr: zod_1.z.string(),
    capacity: zod_1.z.number(),
    usage: zod_1.z.string(),
    school: zod_1.z.string(),
});
exports.bookingSchema = zod_1.z.object({
    name: zod_1.z.string(),
    bookingType: zod_1.z.string(),
    start: zod_1.z.date(),
    end: zod_1.z.date(),
});
exports.roomStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["free", "soon", "busy"]),
    endtime: zod_1.z.string(),
});
exports.roomStatusesSchema = zod_1.z.record(zod_1.z.string(), exports.roomStatusSchema);
exports.buildingStatusSchema = zod_1.z.object({
    numAvailable: zod_1.z.number(),
    roomStatuses: exports.roomStatusesSchema,
});
exports.schoolSchema = zod_1.z.object({
    name: zod_1.z.string(),
    homepage: zod_1.z.string(),
    contactLink: zod_1.z.string(),
});
exports.ratingSchema = zod_1.z.object({
    cleanliness: zod_1.z.number(),
    location: zod_1.z.number(),
    quietness: zod_1.z.number(),
    overall: zod_1.z.number(),
});
exports.averageRatingSchema = zod_1.z.object({
    cleanliness: zod_1.z.number(),
    location: zod_1.z.number(),
    quietness: zod_1.z.number(),
});
///////////////////////////////////////////////////////////////
// API Response Types
exports.buildingsResponseSchema = zod_1.z.object({
    buildings: zod_1.z.array(exports.buildingSchema),
});
exports.roomsResponseSchema = zod_1.z.object({
    rooms: zod_1.z.record(zod_1.z.string(), exports.roomSchema),
});
exports.statusResponseSchema = zod_1.z.record(zod_1.z.string(), exports.buildingStatusSchema);
exports.searchResponseValueSchema = exports.roomStatusSchema.extend({
    name: zod_1.z.string(),
});
exports.searchResponseSchema = zod_1.z.record(zod_1.z.string(), exports.searchResponseValueSchema);
exports.bookingsResponseSchema = zod_1.z.object({
    bookings: zod_1.z.array(exports.bookingSchema),
});
// how ratings are stored in Mongo
exports.rawRatingDocumentSchema = zod_1.z.object({
    roomId: zod_1.z.string(),
    ratings: zod_1.z.array(exports.ratingSchema),
});
exports.ratingsResponseSchema = zod_1.z.object({
    // roomId refers to room name
    roomId: zod_1.z.string(),
    overallRating: zod_1.z.number(),
    averageRating: exports.averageRatingSchema,
});
exports.buildingRatingsResponseSchema = zod_1.z.object({
    buildingId: zod_1.z.string(),
    overallRating: zod_1.z.number(),
});
exports.roomUtilitiesResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    floor: zod_1.z.string().nullable(),
    seating: zod_1.z.string().nullable(),
    microphone: zod_1.z.array(zod_1.z.string()),
    accessibility: zod_1.z.array(zod_1.z.string()),
    audiovisual: zod_1.z.array(zod_1.z.string()),
    infotechnology: zod_1.z.array(zod_1.z.string()),
    writingMedia: zod_1.z.array(zod_1.z.string()),
    service: zod_1.z.array(zod_1.z.string()),
});
///////////////////////////////////////////////////////////////
// API Request Types
exports.roomIdParamsSchema = zod_1.z.object({
    roomID: zod_1.z.string().min(1),
});
exports.buildingIdParamsSchema = zod_1.z.object({
    buildingID: zod_1.z.string().min(1),
});
exports.ratingParamsSchema = zod_1.z.object({
    buildingID: zod_1.z.string().min(1),
    roomID: zod_1.z.string().min(1),
});
exports.roomUtilitiesParamsSchema = zod_1.z.object({
    roomId: zod_1.z.string().min(1),
});
exports.statusQuerySchema = zod_1.z.object({
    datetime: zod_1.z.string().optional(),
    capacity: zod_1.z.string().optional(),
    usage: zod_1.z.string().optional(),
    location: zod_1.z.enum(["upper", "lower"]).optional(),
    duration: zod_1.z.string().optional(),
    recurring: zod_1.z.string().optional(),
    id: zod_1.z.enum(["true", "false"]).optional(),
});
exports.searchQuerySchema = exports.statusQuerySchema.extend({
    buildingId: zod_1.z.string().optional(),
    startTime: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
});
exports.ratingCreatedResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
});
