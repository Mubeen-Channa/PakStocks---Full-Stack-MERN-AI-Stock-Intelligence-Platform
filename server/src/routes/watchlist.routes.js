import { Router } from "express";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlist.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getWatchlist));
router.post("/", asyncHandler(addToWatchlist));
router.delete("/:id", asyncHandler(removeFromWatchlist));

export default router;
