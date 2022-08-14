import express from "express";
import path from "path";
import morganMiddleware from "./middlewares/morganMiddleware";

import indexRouter from "./routes/index";
import fetchRouter from "./routes/fetch";
import scrapeRouter from "./routes/scrape";

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// TODO Add auth for endpoint other than GET
app.use("/", indexRouter);
app.use("/fetch", fetchRouter);
app.use("/scrape", scrapeRouter);

export default app;
