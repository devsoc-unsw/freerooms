import express, { NextFunction, Request, Response } from "express";
import fs from "fs";

import { getDate, scrapeBuildingData } from "./helpers";
import {
  getAllRoomStatus,
  getAllBuildings,
  getRoomAvailability,
} from "./service";

import cors from "cors";

const app = express();
const PORT = 3000;
app.use(cors());

const errorHandler = (res: Response, message: string) => {
  console.error(`Error: ${message}`);
  res.send({
    message: message,
    status: 400,
  });
};

// Route to get all the buildings
app.get("/buildings", async (req: Request, res: Response) => {
  try {
    const buildingData = await getAllBuildings();
    const data = { buildings: buildingData };
    res.send(data);
  } catch (error: any) {
    errorHandler(res, error.message);
  }
});

// Route to get all the rooms in a particular building
app.get("/buildings/:buildingID", async (req: Request, res: Response) => {
  const { buildingID } = req.params;
  const datetimeString = req.query.datetime as string;

  try {
    const datetime = datetimeString ? getDate(datetimeString) : new Date();

    if (datetime === null) {
      res.send({ message: "Invalid date", status: 400 });
      return;
    }

    const roomData = await getAllRoomStatus(buildingID, datetime);
    const data = { rooms: roomData };
    res.send(data);
  } catch (error: any) {
    errorHandler(res, error.message);
  }
});

// Route to get the availability of a particular room in a particular building
app.get(
  "/buildings/:buildingID/:roomNumber",
  async (req: Request, res: Response) => {
    const { buildingID, roomNumber } = req.params;

    try {
      const data = await getRoomAvailability(buildingID, roomNumber);
      res.send(data);
    } catch (error: any) {
      errorHandler(res, error.message);
    }
  }
);

// After each request, check if database.json needs to be updated
app.use(async (req: Request, res: Response, next: NextFunction) => {
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
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});