import express from "express";
import { scrapeData } from "../controllers/scrape.js";
import { checkBody } from "../middlewares/validateRequest.js";

const router = express.Router();

router.route("/list").post(checkBody("list"), scrapeData("list"));

router.route("/manga").post(checkBody("manga"), scrapeData("manga"));

router.route("/chapter").post(checkBody("chapter"), scrapeData("chapter"));

export default router;
