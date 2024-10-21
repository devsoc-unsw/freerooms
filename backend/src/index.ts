import cors from "cors";
import express, {
  json,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import { PORT } from "./config";
import { getRatings, insertRating } from "./ratingDbInterface";
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

// get all ratings for a room given roomId
app.get(
  "/api/rating/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = req.params;
    const roomRatings = await getRatings(roomID);
    res.send(roomRatings);
    next();
  })
);

// insert one rating
app.post("/api/rating/rate/:roomID", async (req: Request, res: Response) => {
  const { roomID } = req.params;
  const { quietness, location, cleanliness, overall } = req.body;
  const ratings = [quietness, location, cleanliness, overall];
  try {
    await insertRating(roomID, ratings);
    res.status(200).json({ message: "rating inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

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
