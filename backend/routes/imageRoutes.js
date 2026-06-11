import express from "express";

import upload from "../middleware/upload.js";

import { processImageController } from "../controllers/imageController.js";

const router = express.Router();

router.post(
  "/process",
  upload.single("image"),
  processImageController
);

export default router;