import express from "express";
import { fetchStatus, fetchProviderList, fetchMangaData } from "../controllers/fetch";
import { validateUUID, validateProvider } from "../validations";
var router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/list"));

router.route("/status/:id").get(validateUUID, fetchStatus);

router.route("/manga-provider").get(fetchProviderList);

router.route("/manga-list/:provider").get(validateProvider, fetchMangaData("MangaList"));

router.route("/manga/:provider/:slug").get(validateProvider, fetchMangaData("Manga"));

router.route("/chapter-list/:provider/:slug").get(validateProvider, fetchMangaData("ChapterList"));

router.route("/chapter/:provider/:slug").get(validateProvider, fetchMangaData("Chapter"));

export default router;
