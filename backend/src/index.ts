import {
  buildingsResponseSchema,
  BuildingRatingsResponse,
  buildingRatingsResponseSchema,
  bookingsResponseSchema,
  ratingsResponseSchema,
  ratingSchema,
  roomUtilitiesResponseSchema,
  roomsResponseSchema,
  searchResponseSchema,
  statusResponseSchema,
} from "common/types";
import cors from "cors";
import express, {
  json,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { z } from "zod";

import { PORT } from "./config";
import { getRoomUtilities } from "./helpers";
import {
  getAllBuildingRatings,
  getAllRoomRatingsInBuilding,
  getBuildingRatings,
  getRatings,
  insertBuldingRating,
  insertRating,
} from "./ratingDbInterface";
import {
  parseSearchFilters,
  parseStatusDatetime,
  parseStatusFilters,
} from "./requestParsers";
import {
  getAllBuildings,
  getAllRooms,
  getAllRoomStatus,
  getRoomBookings,
  searchAllRoom,
} from "./service";

const app = express();
app.use(cors());
app.use(json());

const roomIdParamsSchema = z.object({
  roomID: z.string().min(1),
});

const buildingIdParamsSchema = z.object({
  buildingID: z.string().min(1),
});

const ratingParamsSchema = z.object({
  buildingID: z.string().min(1),
  roomID: z.string().min(1),
});

const roomUtilitiesParamsSchema = z.object({
  roomId: z.string().min(1),
});

const sendValidated = <T>(
  res: Response,
  schema: z.ZodType<T>,
  data: unknown
): void => {
  res.send(schema.parse(data));
};

// Wrapper for request handler functions to catch async exceptions
const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Route to get info of all the buildings
app.get(
  "/api/buildings",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buildingData = await getAllBuildings();
    sendValidated(res, buildingsResponseSchema, buildingData);
    next();
  })
);

// Route to get info of all the rooms
app.get(
  "/api/rooms",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const roomData = await getAllRooms();
    sendValidated(res, roomsResponseSchema, roomData);
    next();
  })
);

// Route to get status of all rooms
app.get(
  "/api/rooms/status",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const datetime = parseStatusDatetime(req);
    const filters = parseStatusFilters(req);
    const data = await getAllRoomStatus(datetime, filters);
    sendValidated(res, statusResponseSchema, data);
    next();
  })
);

// Route to search all rooms
app.get(
  "/api/rooms/search",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const datetime = parseStatusDatetime(req);
    const filters = parseSearchFilters(req);
    const data = await searchAllRoom(datetime, filters);
    sendValidated(res, searchResponseSchema, data);
    next();
  })
);

// Route to get the bookings of a particular room
app.get(
  "/api/rooms/bookings/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = roomIdParamsSchema.parse(req.params);
    const data = await getRoomBookings(roomID);
    sendValidated(res, bookingsResponseSchema, data);
    next();
  })
);

// Get all ratings for a room given a roomId
app.get(
  "/api/rating/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = roomIdParamsSchema.parse(req.params);
    const roomRatings = await getRatings(roomID);
    sendValidated(res, ratingsResponseSchema, roomRatings);
    next();
  })
);

// Get ratings of all rooms in a building
app.get(
  "/api/rating/rooms/:buildingID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { buildingID } = buildingIdParamsSchema.parse(req.params);
    const roomRatings = await getAllRoomRatingsInBuilding(buildingID);
    sendValidated(res, ratingsResponseSchema.array(), roomRatings);
    next();
  })
);

// Insert one rating for a room
app.post(
  "/api/rating/rate/:buildingID/:roomID",
  asyncHandler(async (req: Request, res: Response) => {
    const { buildingID, roomID } = ratingParamsSchema.parse(req.params);
    const rating = ratingSchema.parse(req.body);
    try {
      // Insert a new rating object to room document
      await insertRating(roomID, [
        rating.cleanliness,
        rating.location,
        rating.quietness,
        rating.overall,
      ]);
      // Update the overall rating of the building
      await insertBuldingRating(buildingID, rating.overall);
      res.status(200).json({ message: "rating inserted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })
);

// Get overall rating for a building given a buildingID
app.get(
  "/api/buildingRating/:buildingID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { buildingID } = buildingIdParamsSchema.parse(req.params);
    let buildingRating: BuildingRatingsResponse | null =
      await getBuildingRatings(buildingID);

    // no reviews for current building
    if (buildingRating === null) {
      buildingRating = {
        buildingId: buildingID,
        overallRating: 0,
      };
    }

    sendValidated(res, buildingRatingsResponseSchema, buildingRating);
    next();
  })
);

// Get overall ratings for all buildings
app.get(
  "/api/buildingRating",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buildingData = await getAllBuildings();
    const buildingRatings = await getAllBuildingRatings();

    const ratingsByBuildingId = new Map(
      buildingRatings.map((rating) => [rating.buildingId, rating])
    );

    const allBuildingRatings: BuildingRatingsResponse[] =
      buildingData.buildings.map(
        (building) =>
          ratingsByBuildingId.get(building.id) ?? {
            buildingId: building.id,
            overallRating: 0,
          }
      );

    sendValidated(
      res,
      buildingRatingsResponseSchema.array(),
      allBuildingRatings
    );
    next();
  })
);

// Route to get utilities of a room
app.get(
  "/api/rooms/utilities/:roomId",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = roomUtilitiesParamsSchema.parse(req.params);
    const roomUtilities = await getRoomUtilities(roomId);
    sendValidated(res, roomUtilitiesResponseSchema, roomUtilities);
    next();
  })
);

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`"${req.originalUrl}" ${err.stack ?? err}`);

  if (!res.writableEnded) {
    res.status(400).send(err);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
