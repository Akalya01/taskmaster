import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(getTasks));
router.post("/", asyncHandler(createTask));
router.put("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
