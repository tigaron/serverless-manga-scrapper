import express from "express";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import fetch from "./routes/fetch.js";
import scrape from "./routes/scrape.js";
import update from "./routes/update.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleware);

app.use("/fetch", fetch);
app.use("/scrape", scrape);
app.use("/update", update);

app.get("/", (req, res) => {
  res.json("Welcome my friend!");
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Route does not exist",
  });
});

export default app;
