import express from "express";
import { updateData } from "../controllers/update.js";
import { checkBody } from "../middlewares/validateRequest.js";

const router = express.Router();

router.route("/chapter").put(checkBody("chapter"), updateData("chapter"));

export default router;
