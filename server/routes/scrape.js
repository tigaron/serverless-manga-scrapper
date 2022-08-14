import express from "express";
import {
	scrapeMangaList,
	scrapeManga,
	scrapeChapterList,
	scrapeChapter,
} from "../controllers/scrape.js";
import { validateBody } from "../validations/index.js";
const router = express.Router();

router.route("/manga-list").post(validateBody("Provider"), scrapeMangaList);

router.route("/manga").post(validateBody("ProviderSlug"), scrapeManga);

router.route("/chapter-list").post(validateBody("ProviderSlug"), scrapeChapterList);

router.route("/chapter").post(validateBody("ProviderMangaSlug"), scrapeChapter);

export default router;
