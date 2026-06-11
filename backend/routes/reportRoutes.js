import express from "express";

import { generateReportController } from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReportController);

export default router;