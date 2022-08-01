import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import scrape from "./routes/scrape.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/scrape", scrape);

app.get("/", (req, res) => {
    res.json("Welcome my friend!");
});

app.use((req, res) => {
    return res.status(404).json({
      error: "Not Found",
    });
});

export default app;
