import express from "express";
import { getStatus, getSourceList, fetchData } from "../controllers/fetch.js";
import { checkSource } from "../middlewares/validateRequest.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/list"));

router.route("/status/:id").get(getStatus);

router.route("/list").get(getSourceList);

router.route("/list/:source").get(checkSource, fetchData("list"));

router.route("/manga/:source/:slug").get(checkSource, fetchData("manga"));

router.route("/chapters/:source/:slug").get(checkSource, fetchData("chapters"));

router.route("/chapter/:source/:slug").get(checkSource, fetchData("chapter"));

export default router;
