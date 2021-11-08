import express, { Request, Response } from "express";
import { getDate, getAllRoomStatus} from "./service";

const app = express();
const PORT = 3000;

// index.ts only job is extracting the parameters from the url. There should be no other logic
// Pass these parameters to service.ts and then `return res.send()` the result

// Route to get all the buildings
app.get("/buildings", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Route to get all the rooms in a particular building
app.get("/buildings/:buildingId", async (req: Request, res: Response) => {
  const { buildingId } = req.params;
  const datetimeString = req.query.datetime as string;
  
  try {
    const datetime = datetimeString ? getDate(datetimeString) : new Date();
    
    if (datetime === null) {
      res.send({message: "Invalid date", status: 400});
      return;
    }
    
    const data = await getAllRoomStatus(buildingId, datetime);
    res.send(data);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    res.send({
      message: error.message,
      status: 400,
    });
  }
});

// Route to get the availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
