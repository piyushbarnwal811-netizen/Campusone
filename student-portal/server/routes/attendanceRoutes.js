import express from "express";
import {
  deleteAttendance,
  getAllAttendance,
  getMyAttendance,
  markAttendance,
  updateAttendance
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorizeRoles("student"), getMyAttendance);
router.get("/", protect, authorizeRoles("admin", "faculty"), getAllAttendance);
router.post("/", protect, authorizeRoles("admin", "faculty"), markAttendance);
router.put("/:id", protect, authorizeRoles("admin", "faculty"), updateAttendance);
router.delete("/:id", protect, authorizeRoles("admin", "faculty"), deleteAttendance);

export default router;
