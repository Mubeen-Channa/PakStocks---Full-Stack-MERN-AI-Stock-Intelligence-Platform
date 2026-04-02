import { Router } from "express";
import { getStockValues } from "../controllers/stocksValues.controller.js";

const router = Router();

router.get("/", getStockValues);

export default router;
