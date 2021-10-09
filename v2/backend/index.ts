import express from "express";

const app = express();
const PORT = 3000;

app.get("/buildings", (req: express.Request, res: express.Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
