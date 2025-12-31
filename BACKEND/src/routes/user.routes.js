import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/profile", protect, asyncHandler(getProfile));
router.put("/profile", protect, asyncHandler(updateProfile));
router.put("/change-password", protect, asyncHandler(changePassword));

export default router;
