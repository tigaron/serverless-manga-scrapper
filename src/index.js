const express = require("express");
const scrape = require("./routes/scrape.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/scrape", scrape);

app.get("/", (req, res) => {
    res.json("Welcome here!");
});

app.use((req, res) => {
    return res.status(404).json({
      error: "Not Found",
    });
});

module.exports = app;
