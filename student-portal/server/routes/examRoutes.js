import express from "express";
import {
  createExam,
  deleteExam,
  getExams,
  getMyExams,
  updateExam
} from "../controllers/examController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorizeRoles("student"), getMyExams);
router.get("/", protect, getExams);
router.post("/", protect, authorizeRoles("admin"), createExam);
router.put("/:id", protect, authorizeRoles("admin"), updateExam);
router.delete("/:id", protect, authorizeRoles("admin"), deleteExam);

export default router;
