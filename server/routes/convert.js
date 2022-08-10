import express from "express";
import { convertImg } from "../controllers/convert";
import { validateBody } from "../middlewares/validateRequest";
var router = express.Router();

router.route("/chapter").put(validateBody("chapter"), convertImg);

export default router;
