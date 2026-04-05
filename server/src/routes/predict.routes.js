import express from "express";
import { getPrediction } from "../controllers/predict.controller.js";

const router = express.Router();

router.get("/:symbol", getPrediction);

export default router;