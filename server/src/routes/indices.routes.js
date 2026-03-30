import { Router } from "express";
import { getAllIndices } from "../controllers/indices.controller.js";

const router = Router();

router.get("/", getAllIndices);

export default router;
