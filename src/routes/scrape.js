import express from "express";
import { scrapeData } from "../controllers/scrape.js";

const router = express.Router();

router.route("/list").post(scrapeData("list"));

router.route("/manga").post(scrapeData("manga"));

router.route("/chapter").post(scrapeData("chapter"));

export default router;
