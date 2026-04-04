import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  getPortfolio,
  addHolding,
  removeBySymbol,
} from "../controllers/portfolio.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getPortfolio));
router.post("/", asyncHandler(addHolding));
router.delete("/symbol/:symbol", asyncHandler(removeBySymbol));

export default router;