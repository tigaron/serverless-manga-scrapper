import express from "express";
import {
	scrapeMangaList,
	scrapeManga,
	scrapeChapterList,
	scrapeChapter,
} from "../controllers/scrape";
import { validateBody } from "../validations";
var router = express.Router();

router.route("/manga-list").post(validateBody("list"), scrapeMangaList);

router.route("/manga").post(validateBody("manga"), scrapeManga);

router.route("/chapter-list").post(validateBody("manga"), scrapeChapterList);

router.route("/chapter").post(validateBody("chapter"), scrapeChapter);

export default router;
