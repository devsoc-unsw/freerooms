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


// Image Storage for Uploads
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, '../../images')
    },
    filename : (req, file, cb) => {
        const { roomID } = req.body;
        if (roomID) {
            // Room Id Image; Possibly extract name instead later? 
            cb(null, `${roomID}_${Date.now()}${path.extname(file.originalname)}`);
        } else {
            // Default Image Name if no roomID is provided.
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }
})

// Multer upload middleware
const upload = multer({ storage: storage });


// Upload image Route
app.post('/api/rooms/images/upload', 
    upload.single('image'), 
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }
        // Multer Middleware handles save automically;
        res.status(200).json({ message: 'Image uploaded successfully.' });
        next();
    })
);

// List Image Filenames
// Currently returns all images
app.get('/api/rooms/images/list/all', 
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const imagesDir = '../../images';
        const files = await fs.promises.readdir(imagesDir);
        res.status(200).json({ images: files });
        next();
    })
);

// Get specific room images
app.get('/api/rooms/images/list/:roomId', 
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const imagesDir = '../../images';
        const roomId = req.params.roomId;
        const files = await fs.promises.readdir(imagesDir);
        // TODO: Currently grabs all files based on roomId string.
        const roomFiles = files.filter(file => file.startsWith(`${roomId}_`));
        res.status(200).json({ images: roomFiles });
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
