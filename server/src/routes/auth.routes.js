import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { googleLoginSchema } from "../validators/auth.schema.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { googleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post( "/google",
validate(googleLoginSchema),
  asyncHandler(googleLogin)
);

export default router;
