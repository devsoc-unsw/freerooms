import express, { Request, Response } from "express";
import { getAllRoomStatus } from "./service";

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
  //Get current date
  let currDate = new Date();
  const datetime = req.query.datetime as string;
  console.log({ buildingId, datetime });
  // Check if datetime query was passed
  if (datetime) {
    let timestamp = Date.parse(datetime);
    if (isNaN(timestamp)) {
      res.send({
        message: "Invalid date",
        status: 400,
      });
      return;
    } else {
      // If it is a valid date, change currDate to instead be the datetime passed in the query
      currDate = new Date(datetime);
    }
  }
  let data;
  try {
    data = await getAllRoomStatus(buildingId, currDate);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    res.send({
      message: error.message,
      status: 400,
    });
  }
  return res.send(data);
});

// Route to get the availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
