import { Router } from "express";
import { getStockHistory } from "../controllers/history.controller.js";

const router = Router();

router.get("/:symbol", getStockHistory);

export default router;