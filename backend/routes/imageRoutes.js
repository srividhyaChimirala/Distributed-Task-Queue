// import express from "express";

// import upload from "../middleware/upload.js";

// import { processImageController } from "../controllers/imageController.js";

// const router = express.Router();

// router.post(
//   "/process",
//   upload.single("image"),
//   processImageController
// );

// export default router;
import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import { processImageController } from "../controllers/imageController.js";

const router = express.Router();

router.post(
  "/process",
  protect,
  upload.single("image"),
  processImageController
);

export default router;