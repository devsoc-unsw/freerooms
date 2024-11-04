import cors from "cors";
import express, {
  json,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import { PORT } from "./config";
import {
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
import { BuildinRatingsResponse } from "@common/types";

const app = express();
app.use(cors());
app.use(json());

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
    res.send(buildingData);
    next();
  })
);

// Route to get info of all the rooms
app.get(
  "/api/rooms",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const roomData = await getAllRooms();
    res.send(roomData);
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
    res.send(data);
    next();
  })
);

// Route to search all rooms
app.get(
  "/api/rooms/search",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = parseSearchFilters(req);
    const data = await searchAllRoom(filters);
    res.send(data);
    next();
  })
);

// Route to get the bookings of a particular room
app.get(
  "/api/rooms/bookings/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = req.params;
    const data = await getRoomBookings(roomID);
    res.send(data);
    next();
  })
);

// Get all ratings for a room given a roomId
app.get(
  "/api/rating/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = req.params;
    const roomRatings = await getRatings(roomID);
    res.send(roomRatings);
    next();
  })
);

// Insert one rating for a room
app.post(
  "/api/rating/rate/:buildingID/:roomID",
  async (req: Request, res: Response) => {
    const { buildingID, roomID } = req.params;
    const { quietness, location, cleanliness, overall } = req.body;
    const ratings = [quietness, location, cleanliness, overall];
    try {
      // Insert a new rating object to room document
      await insertRating(roomID, ratings);
      // Update the overall rating of the building
      await insertBuldingRating(buildingID, overall);
      res.status(200).json({ message: "rating inserted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

// Get overall rating for a building given a buildingID
app.get(
  "/api/buildingRating/:buildingID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { buildingID } = req.params;
    let buildingRating: BuildinRatingsResponse | null =
      await getBuildingRatings(buildingID);

    // no reviews for current building
    if (buildingRating === null) {
      console.log("TEST");
      buildingRating = {
        buildingId: buildingID,
        overallRating: 0,
      };
    }

    res.send(buildingRating);
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
