import express from "express";
import {
	fetchStatus,
	fetchProviderList,
	fetchListData,
	fetchMangaData,
	fetchChapterData,
} from "../controllers/fetch";
import { validateUUID, validateProvider } from "../validations";
const router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/list"));

router.route("/status/:id").get(validateUUID, fetchStatus);

router.route("/manga-provider").get(fetchProviderList);

router.route("/manga-list/:provider").get(validateProvider, fetchListData);

router.route("/manga/:provider/:slug").get(validateProvider, fetchMangaData);

router.route("/chapter-list/:provider/:slug").get(validateProvider, fetchListData);

router.route("/chapter/:provider/:manga/:slug").get(validateProvider, fetchChapterData);

export default router;
