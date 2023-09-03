import express, { NextFunction, Request, RequestHandler, Response, static as static_ } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import { scrapeBuildingData } from "./helpers";
import {
  parseDatetime,
  parseFilters,
  getAllRoomStatus,
  getAllBuildings,
  getRoomBookings,
} from "./service";
import { DATABASE_PATH, PORT } from "./config";
import multer, { Multer } from 'multer';
import { pathToFileURL } from "url";

const app = express();
app.use(cors());
app.use('/static', express.static('/images'))

// Wrapper for request handler functions to catch async exceptions
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }

// Route to get all the buildings
app.get(
  "/api/buildings",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buildingData = await getAllBuildings();
    const data = { buildings: buildingData };
    res.send(data);
    next();
  })
);

// Route to get status of all rooms
app.get(
  "/api/rooms",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const datetime = parseDatetime(req);
    const filters = parseFilters(req);
    const data = await getAllRoomStatus(datetime, filters);
    res.send(data);
    next();
  })
);

// Route to get the bookings of a particular room in a particular building
app.get(
  "/api/rooms/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = req.params;
    const [campus, buildingGrid, roomNumber] = roomID.split('-');

    const data = await getRoomBookings(`${campus}-${buildingGrid}`, roomNumber);
    res.send(data);
    next();
  })
);

// After each request, check if database.json needs to be updated
app.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = new Date();
    const stat = fs.statSync(DATABASE_PATH);
    if (
      timeNow.getFullYear() - stat.mtime.getFullYear() > 0 ||
      timeNow.getMonth() - stat.mtime.getMonth() > 0
    ) {
      await scrapeBuildingData();
    }
    next();
  })
);

// Image Storage for Uploads
// TODO: Errors not handled
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, '../../images')
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

// Multer upload middleware
const upload = multer({ storage: storage });


// Upload image Route
// Save to static images folder of some sort
// TODO: upload.single('image') -> 'image' must align with variable name of file in frontend uploaded by user
app.post("/api/rooms/images/upload", upload.single('image'), (err: Error, req: Request, res: Response) => {
    const {roomID, file} = req.body;
    try {
        if (!req.file) {
          return res.status(400).json({ message: 'No image file provided.' });
        }
        // If the image is successfully uploaded, you can respond with a success message.
        return res.status(200).json({ message: 'Image uploaded successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong.' });
    }
})

// List Image Filenames 
app.get("/api/rooms/images/list", (err: Error, req: Request, res: Response) => {
    const images: string[] = [

    ];
    
    res.status(200).json({
        images: images
    })
})

// Static Image Endpoint
// TODO -> 


// Static Image Folder

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`"${req.originalUrl}" ${err.stack ?? err}`)

  if (!res.writableEnded) {
    res.status(400).send(err);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
