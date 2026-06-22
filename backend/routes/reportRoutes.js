// import express from "express";

// import { generateReportController } from "../controllers/reportController.js";

// const router = express.Router();

// router.post("/generate", generateReportController);

// export default router;


import express from "express";
import { protect } from "../middleware/auth.js";
import { generateReportController } from "../controllers/reportController.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateReportController
);

export default router;