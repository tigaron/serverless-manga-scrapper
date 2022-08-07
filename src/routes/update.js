import express from "express";
import { updateData } from "../controllers/update.js";
import { checkBody } from "../middlewares/validateRequest.js";

const router = express.Router();

router.route("/list").put(checkBody("list"), updateData("list"));

router.route("/manga").put(checkBody("manga"), updateData("manga"));

router.route("/chapter").put(checkBody("chapter"), updateData("chapter"));

export default router;
