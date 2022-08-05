import express from "express";
import { getSourceList, scrapeData } from "../controllers/scrape.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/scrape/list"));

router.route("/list").get(getSourceList);

router.route("/manga/:source").get(scrapeData("list"));

router.route("/manga/:source/:slug").get(scrapeData("manga"));

router.route("/chapter/:source/:slug").get(scrapeData("chapter"));

export default router;
