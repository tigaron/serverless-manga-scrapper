// TODO add endpoint to convert img content to progressive and compressed version
import express from "express";
import { convertImg } from "../controllers/convert";
import { validateBody } from "../middlewares/validateRequest";
var router = express.Router();

router.route("/chapter").put(validateBody("chapter"), convertImg);

export default router;
