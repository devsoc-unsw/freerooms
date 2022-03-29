import express, { Request, Response } from "express";
import cors from "cors";

import { getDate } from "./helpers";
import {
  getAllRoomStatus,
  getAllBuildings,
  getRoomAvailability,
} from "./service";

const app = express();
const PORT = 3001;
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

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
