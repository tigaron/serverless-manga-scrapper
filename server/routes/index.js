import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  res.render("index", { title: "Manga Scraper API" });
});

export default router;
