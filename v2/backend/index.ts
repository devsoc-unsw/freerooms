import express, { NextFunction, Request, RequestHandler, Response } from "express";
import cors from "cors";
import fs from "fs";

import { getDate, scrapeBuildingData } from "./helpers";
import {
  getAllRoomStatus,
  getAllBuildings,
  getRoomAvailability,
} from "./service";
import { Filters } from "./types";

const app = express();
const PORT = 3001;
app.use(cors());

// Wrapper for request handler functions to catch async exceptions
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }

// Route to get all the buildings
app.get(
  "/buildings",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buildingData = await getAllBuildings();
    const data = { buildings: buildingData };
    res.send(data);
    next();
  })
);

// Route to get all the rooms in a particular building
app.get(
  "/buildings/:buildingID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { buildingID } = req.params;

    const datetimeString = req.query.datetime as string;
    const datetime = datetimeString ? getDate(datetimeString) : new Date();
    if (datetime === null) {
      throw new Error('Invalid datetime');
    }

    let filters: Filters = {
      capacity: 0,
      duration: 0,
      usage: null,
      location: null,
    };
  
    if (req.query.capacity) {
      const capacity = parseInt(req.query.capacity as string);
      if (isNaN(capacity) || capacity < 0) {
        throw new Error('Invalid capacity');
      }
      filters.capacity = capacity;
    }

    if (req.query.duration) {
      const duration = parseInt(req.query.duration as string);
      if (isNaN(duration) || duration < 0) {
        throw new Error('Invalid duration');
      }
      filters.capacity = duration;
    }

    if (req.query.usage) {
      const usage = req.query.usage as string;
      if (usage !== 'LEC' && usage !== 'TUT') {
        throw new Error('Invalid usage: must be one of "LEC" or "TUT"');
      }
      filters.usage = usage;
    }

    if (req.query.location) {
      const location = req.query.location as string;
      if (location !== 'upper' && location !== 'lower') {
        throw new Error('Invalid location: must be one of "upper" or "lower"');
      }
      filters.location = location;
    }

    const roomData = await getAllRoomStatus(buildingID, datetime, filters);
    const data = { rooms: roomData };
    res.send(data);
    next();
  })
);

// Route to get the availability of a particular room in a particular building
app.get(
  "/buildings/:buildingID/:roomNumber",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { buildingID, roomNumber } = req.params;

    const data = await getRoomAvailability(buildingID, roomNumber);
    res.send(data);
    next();
  })
);

// After each request, check if database.json needs to be updated
app.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = new Date();
    const stat = fs.statSync('database.json', { throwIfNoEntry: false });
    if (
      !stat ||
      timeNow.getFullYear() - stat.mtime.getFullYear() > 0 ||
      timeNow.getMonth() - stat.mtime.getMonth() > 0
    ) {
      await scrapeBuildingData();
    }
    next();
  })
);

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`"${req.originalUrl}" ${err}`)

  if (!res.writableEnded) {
    res.send({ message: err.toString(), status: 400 });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});