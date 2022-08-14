import express from "express";
import fetch from "../controllers/fetch";
import validate from "../validations";
const router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/manga-provider"));

router.route("/status/:id").get(validate.uuid, fetch.status);

router.route("/manga-provider").get(fetch.providerData);

router.route("/manga-list/:provider").get(validate.provider, fetch.listData);

router.route("/manga/:provider/:slug").get(validate.provider, fetch.mangaData);

router.route("/chapter-list/:provider/:slug").get(validate.provider, fetch.listData);

router.route("/chapter/:provider/:manga/:slug").get(validate.provider, fetch.chapterData);

export default router;
