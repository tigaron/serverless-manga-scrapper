import express from "express";
import { getSourceList, fetchList, fetchData } from "../controllers/fetch.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/list"));

router.route("/list").get(getSourceList);

router.route("/manga/:source").get(fetchList);

router.route("/manga/:source/:slug").get(fetchData("manga"));

router.route("/chapter/:source/:slug").get(fetchData("chapter"));

export default router;
