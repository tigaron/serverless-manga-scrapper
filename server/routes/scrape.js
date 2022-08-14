import express from "express";
import {
	scrapeMangaList,
	scrapeManga,
	scrapeChapterList,
	scrapeChapter,
} from "../controllers/scrape";
import { validateBody } from "../validations";
const router = express.Router();

router.route("/manga-list").post(validateBody("Provider"), scrapeMangaList);

router.route("/manga").post(validateBody("ProviderSlug"), scrapeManga);

router.route("/chapter-list").post(validateBody("ProviderSlug"), scrapeChapterList);

router.route("/chapter").post(validateBody("ProviderMangaSlug"), scrapeChapter);

export default router;
