import express from "express";

const app = express();
const PORT = 3000;

// index.ts only job is extracting the parameters from the url. There should be no other logic
// Pass these parameters to service.ts and then `return res.send()` the result

app.get("/buildings", (req: express.Request, res: express.Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
