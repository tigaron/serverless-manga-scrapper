import express from "express";
import morganMiddleware from "./middlewares/morganMiddleware.js";

import indexRouter from "./routes/index.js";
import fetchRouter from "./routes/fetch.js";
import scrapeRouter from "./routes/scrape.js";

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public"));

// TODO Add auth for endpoint other than GET
app.use("/", indexRouter);
app.use("/fetch", fetchRouter);
app.use("/scrape", scrapeRouter);

export default app;
