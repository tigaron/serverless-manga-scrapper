import express from "express";
import { updateData } from "../controllers/update";
import { validateBody } from "../middlewares/validateRequest";
var router = express.Router();

router.route("/list").put(validateBody("list"), updateData("list"));

router.route("/manga").put(validateBody("manga"), updateData("manga"));

router.route("/chapter").put(validateBody("chapter"), updateData("chapter"));

export default router;
