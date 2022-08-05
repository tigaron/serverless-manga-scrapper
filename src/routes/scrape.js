import express from "express";
import { scrapeData } from "../controllers/scrape.js";

const router = express.Router();

router.route("/manga/:source").get(scrapeData("list"));

router.route("/manga/:source/:slug").get(scrapeData("manga"));

router.route("/chapter/:source/:slug").get(scrapeData("chapter"));

export default router;
