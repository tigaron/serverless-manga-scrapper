import express from "express";
import { fetchStatus, fetchSourceList, fetchData } from "../controllers/fetch";
import { validateSource } from "../middlewares/validateRequest";
var router = express.Router();

router.get("/", (req, res) => res.redirect(301, "/fetch/list"));

router.route("/status/:id").get(fetchStatus);

router.route("/list").get(fetchSourceList);

router.route("/list/:source").get(validateSource, fetchData("list"));

router.route("/manga/:source/:slug").get(validateSource, fetchData("manga"));

router.route("/chapters/:source/:slug").get(validateSource, fetchData("chapters"));

router.route("/chapter/:source/:slug").get(validateSource, fetchData("chapter"));

export default router;
