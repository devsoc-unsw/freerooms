import {
  bookingsResponseSchema,
  buildingIdParamsSchema,
  BuildingRatingsResponse,
  buildingRatingsResponseSchema,
  buildingsResponseSchema,
  ratingCreatedResponseSchema,
  ratingParamsSchema,
  ratingSchema,
  ratingsResponseSchema,
  roomIdParamsSchema,
  roomsResponseSchema,
  roomUtilitiesParamsSchema,
  roomUtilitiesResponseSchema,
  searchQuerySchema,
  searchResponseSchema,
  statusQuerySchema,
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
import {
  extendZodWithOpenApi,
  openAPIRoute,
} from "express-zod-openapi-autogen";
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
const router = express.Router();
app.use(cors());
app.use(json());
extendZodWithOpenApi(z);

// Wrapper for request handler functions to catch async exceptions
const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Route to get info of all the buildings
router.get(
  "/api/buildings",
  openAPIRoute(
    {
      tag: "Buildings",
      summary: "Get all buildings",
      response: buildingsResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const buildingData = await getAllBuildings();
      res.json(buildingData);
      next();
    })
  )
);

// Route to get info of all the rooms
router.get(
  "/api/rooms",
  openAPIRoute(
    {
      tag: "Rooms",
      summary: "Get all rooms",
      response: roomsResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const roomData = await getAllRooms();
      res.json(roomData);
      next();
    })
  )
);

// Route to get status of all rooms
router.get(
  "/api/rooms/status",
  openAPIRoute(
    {
      tag: "Rooms",
      summary: "Get room availability status",
      query: statusQuerySchema,
      response: statusResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const datetime = parseStatusDatetime(req);
      statusQuerySchema.parse(req.query);
      const filters = parseStatusFilters(req);
      const data = await getAllRoomStatus(datetime, filters);
      res.json(data);
      next();
    })
  )
);

// Route to search all rooms
router.get(
  "/api/rooms/search",
  openAPIRoute(
    {
      tag: "Rooms",
      summary: "Search available rooms",
      query: searchQuerySchema,
      response: searchResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const datetime = parseStatusDatetime(req);
      searchQuerySchema.parse(req.query);
      const filters = parseSearchFilters(req);
      const data = await searchAllRoom(datetime, filters);
      res.json(data);
      next();
    })
  )
);

// Route to get the bookings of a particular room
router.get(
  "/api/rooms/bookings/:roomID",
  openAPIRoute(
    {
      tag: "Bookings",
      summary: "Get bookings for a room",
      params: roomIdParamsSchema,
      response: bookingsResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { roomID } = roomIdParamsSchema.parse(req.params);
      const data = await getRoomBookings(roomID);
      res.json(data);
      next();
    })
  )
);

// Get all ratings for a room given a roomId
router.get(
  "/api/rating/:roomID",
  openAPIRoute(
    {
      tag: "Ratings",
      summary: "Get ratings for a room",
      params: roomIdParamsSchema,
      response: ratingsResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { roomID } = roomIdParamsSchema.parse(req.params);
      const roomRatings = await getRatings(roomID);
      res.json(roomRatings);
      next();
    })
  )
);

// Get ratings of all rooms in a building
router.get(
  "/api/rating/rooms/:buildingID",
  openAPIRoute(
    {
      tag: "Ratings",
      summary: "Get ratings for rooms in a building",
      params: buildingIdParamsSchema,
      response: ratingsResponseSchema.array(),
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { buildingID } = buildingIdParamsSchema.parse(req.params);
      const roomRatings = await getAllRoomRatingsInBuilding(buildingID);
      res.json(roomRatings);
      next();
    })
  )
);

// Insert one rating for a room
router.post(
  "/api/rating/rate/:buildingID/:roomID",
  openAPIRoute(
    {
      tag: "Ratings",
      summary: "Submit a room rating",
      params: ratingParamsSchema,
      body: ratingSchema,
      response: ratingCreatedResponseSchema,
    },
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
        res.json({
          message: "rating inserted successfully",
        });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    })
  )
);

// Get overall rating for a building given a buildingID
router.get(
  "/api/buildingRating/:buildingID",
  openAPIRoute(
    {
      tag: "Ratings",
      summary: "Get a building rating",
      params: buildingIdParamsSchema,
      response: buildingRatingsResponseSchema,
    },
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

      res.json(buildingRating);
      next();
    })
  )
);

// Get overall ratings for all buildings
router.get(
  "/api/buildingRating",
  openAPIRoute(
    {
      tag: "Ratings",
      summary: "Get all building ratings",
      response: buildingRatingsResponseSchema.array(),
    },
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

      res.json(allBuildingRatings);
      next();
    })
  )
);

// Route to get utilities of a room
router.get(
  "/api/rooms/utilities/:roomId",
  openAPIRoute(
    {
      tag: "Rooms",
      summary: "Get room utilities",
      params: roomUtilitiesParamsSchema,
      response: roomUtilitiesResponseSchema,
    },
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { roomId } = roomUtilitiesParamsSchema.parse(req.params);
      const roomUtilities = await getRoomUtilities(roomId);
      res.json(roomUtilities);
      next();
    })
  )
);

app.use(router);

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`"${req.originalUrl}" ${err.stack ?? err}`);

  if (!res.writableEnded) {
    res.status(400).send(err);
  }
  next();
});

export { app, router };

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Freerooms backend now listening on port ${PORT}!`);
  });
}
