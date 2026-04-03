import { Router } from "express";
import {
  createAlert,
  getAlerts,
  checkAlerts,
  deleteAlert,
  markAlertsSeen,
} from "../controllers/alerts.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// PROTECT ALL ALERT ROUTES
router.use(requireAuth);

router.post("/", asyncHandler(createAlert));
router.get("/", asyncHandler(getAlerts));
router.get("/check", asyncHandler(checkAlerts));
router.delete("/:id", deleteAlert);
router.put("/mark-seen", asyncHandler(markAlertsSeen));

export default router;