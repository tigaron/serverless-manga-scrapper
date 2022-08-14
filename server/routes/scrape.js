import express from "express";
import scrape from "../controllers/scrape";
import validate from "../validations";
const router = express.Router();

router.route("/manga-list").post(validate.body("Provider"), scrape.mangaList);

router.route("/manga").post(validate.body("ProviderSlug"), scrape.manga);

router.route("/chapter-list").post(validate.body("ProviderSlug"), scrape.chapterList);

router.route("/chapter").post(validate.body("ProviderMangaSlug"), scrape.chapter);

export default router;
