import { z } from "zod";
export declare const buildingSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
    lat: z.ZodNumber;
    long: z.ZodNumber;
    aliases: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type Building = z.infer<typeof buildingSchema>;
export declare const roomSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
    abbr: z.ZodString;
    capacity: z.ZodNumber;
    usage: z.ZodString;
    school: z.ZodString;
}, z.core.$strip>;
export type Room = z.infer<typeof roomSchema>;
export declare const bookingSchema: z.ZodObject<{
    name: z.ZodString;
    bookingType: z.ZodString;
    start: z.ZodDate;
    end: z.ZodDate;
}, z.core.$strip>;
export type Booking = z.infer<typeof bookingSchema>;
export declare const roomStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        free: "free";
        soon: "soon";
        busy: "busy";
    }>;
    endtime: z.ZodString;
}, z.core.$strip>;
export type RoomStatus = z.infer<typeof roomStatusSchema>;
export declare const roomStatusesSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    status: z.ZodEnum<{
        free: "free";
        soon: "soon";
        busy: "busy";
    }>;
    endtime: z.ZodString;
}, z.core.$strip>>;
export type RoomStatuses = z.infer<typeof roomStatusesSchema>;
export declare const buildingStatusSchema: z.ZodObject<{
    numAvailable: z.ZodNumber;
    roomStatuses: z.ZodRecord<z.ZodString, z.ZodObject<{
        status: z.ZodEnum<{
            free: "free";
            soon: "soon";
            busy: "busy";
        }>;
        endtime: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BuildingStatus = z.infer<typeof buildingStatusSchema>;
export declare const schoolSchema: z.ZodObject<{
    name: z.ZodString;
    homepage: z.ZodString;
    contactLink: z.ZodString;
}, z.core.$strip>;
export type School = z.infer<typeof schoolSchema>;
export declare const ratingSchema: z.ZodObject<{
    cleanliness: z.ZodNumber;
    location: z.ZodNumber;
    quietness: z.ZodNumber;
    overall: z.ZodNumber;
}, z.core.$strip>;
export type Rating = z.infer<typeof ratingSchema>;
export declare const averageRatingSchema: z.ZodObject<{
    cleanliness: z.ZodNumber;
    location: z.ZodNumber;
    quietness: z.ZodNumber;
}, z.core.$strip>;
export type AverageRating = z.infer<typeof averageRatingSchema>;
export declare const buildingsResponseSchema: z.ZodObject<{
    buildings: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
        lat: z.ZodNumber;
        long: z.ZodNumber;
        aliases: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BuildingsResponse = z.infer<typeof buildingsResponseSchema>;
export declare const roomsResponseSchema: z.ZodObject<{
    rooms: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
        abbr: z.ZodString;
        capacity: z.ZodNumber;
        usage: z.ZodString;
        school: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RoomsResponse = z.infer<typeof roomsResponseSchema>;
export declare const statusResponseSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    numAvailable: z.ZodNumber;
    roomStatuses: z.ZodRecord<z.ZodString, z.ZodObject<{
        status: z.ZodEnum<{
            free: "free";
            soon: "soon";
            busy: "busy";
        }>;
        endtime: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export declare const searchResponseValueSchema: z.ZodObject<{
    status: z.ZodEnum<{
        free: "free";
        soon: "soon";
        busy: "busy";
    }>;
    endtime: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type SearchResponseValue = z.infer<typeof searchResponseValueSchema>;
export declare const searchResponseSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    status: z.ZodEnum<{
        free: "free";
        soon: "soon";
        busy: "busy";
    }>;
    endtime: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export declare const bookingsResponseSchema: z.ZodObject<{
    bookings: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        bookingType: z.ZodString;
        start: z.ZodDate;
        end: z.ZodDate;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BookingsResponse = z.infer<typeof bookingsResponseSchema>;
export declare const rawRatingDocumentSchema: z.ZodObject<{
    roomId: z.ZodString;
    ratings: z.ZodArray<z.ZodObject<{
        cleanliness: z.ZodNumber;
        location: z.ZodNumber;
        quietness: z.ZodNumber;
        overall: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RawRatingDocument = z.infer<typeof rawRatingDocumentSchema>;
export declare const ratingsResponseSchema: z.ZodObject<{
    roomId: z.ZodString;
    overallRating: z.ZodNumber;
    averageRating: z.ZodObject<{
        cleanliness: z.ZodNumber;
        location: z.ZodNumber;
        quietness: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;
export declare const buildingRatingsResponseSchema: z.ZodObject<{
    buildingId: z.ZodString;
    overallRating: z.ZodNumber;
}, z.core.$strip>;
export type BuildingRatingsResponse = z.infer<typeof buildingRatingsResponseSchema>;
export declare const roomUtilitiesResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    floor: z.ZodNullable<z.ZodString>;
    seating: z.ZodNullable<z.ZodString>;
    microphone: z.ZodArray<z.ZodString>;
    accessibility: z.ZodArray<z.ZodString>;
    audiovisual: z.ZodArray<z.ZodString>;
    infotechnology: z.ZodArray<z.ZodString>;
    writingMedia: z.ZodArray<z.ZodString>;
    service: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type RoomUtilitiesResponse = z.infer<typeof roomUtilitiesResponseSchema>;
export declare const roomIdParamsSchema: z.ZodObject<{
    roomID: z.ZodString;
}, z.core.$strip>;
export declare const buildingIdParamsSchema: z.ZodObject<{
    buildingID: z.ZodString;
}, z.core.$strip>;
export declare const ratingParamsSchema: z.ZodObject<{
    buildingID: z.ZodString;
    roomID: z.ZodString;
}, z.core.$strip>;
export declare const roomUtilitiesParamsSchema: z.ZodObject<{
    roomId: z.ZodString;
}, z.core.$strip>;
export declare const statusQuerySchema: z.ZodObject<{
    datetime: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodString>;
    usage: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodEnum<{
        upper: "upper";
        lower: "lower";
    }>>;
    duration: z.ZodOptional<z.ZodString>;
    recurring: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
}, z.core.$strip>;
export declare const searchQuerySchema: z.ZodObject<{
    datetime: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodString>;
    usage: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodEnum<{
        upper: "upper";
        lower: "lower";
    }>>;
    duration: z.ZodOptional<z.ZodString>;
    recurring: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    buildingId: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ratingCreatedResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
