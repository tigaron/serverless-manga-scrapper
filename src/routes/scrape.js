import express from "express";
import { scrapeData } from "../controllers/scrape.js";

const router = express.Router();

router.route("/manga/:source").post(scrapeData("list"));

router.route("/manga/:source/:slug").post(scrapeData("manga"));

router.route("/chapter/:source/:slug").post(scrapeData("chapter"));

export default router;
