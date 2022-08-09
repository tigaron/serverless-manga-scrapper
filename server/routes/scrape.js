import express from "express";
import { scrapeData } from "../controllers/scrape";
import { validateBody } from "../middlewares/validateRequest";
var router = express.Router();

router.route("/list").post(validateBody("list"), scrapeData("list"));

router.route("/manga").post(validateBody("manga"), scrapeData("manga"));

router.route("/chapter").post(validateBody("chapter"), scrapeData("chapter"));

export default router;
