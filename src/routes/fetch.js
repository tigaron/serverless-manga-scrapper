import express from "express";
import { fetchData } from "../controllers/fetch.js";

const router = express.Router();

router.get("/", (req, res) => res.json("Here goes nothing!"));

router.route("/manga/:source").get(fetchData("list"));

router.route("/manga/:source/:slug").get(fetchData("manga"));

router.route("/chapter/:source/:slug").get(fetchData("chapter"));

export default router;
