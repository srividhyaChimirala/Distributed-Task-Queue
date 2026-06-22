import express from "express";
import { protect } from "../middleware/auth.js";

import { sendEmail } from "../controllers/emailController.js";

const router = express.Router();


router.post(
  "/send-email",
  protect,
  sendEmail
);
export default router;
