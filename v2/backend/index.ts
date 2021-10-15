import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// index.ts only job is extracting the parameters from the url. There should be no other logic
// Pass these parameters to service.ts and then `return res.send()` the result

// Route to get all the buildings
app.get("/buildings", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Route to get all the rooms in a particular building
app.get("/buildings/:buildingId", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Route to get the availability of a particular room in a particular building
app.get("/buildings/:buildingId/:roomId", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
