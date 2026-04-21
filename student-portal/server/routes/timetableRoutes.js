import express from "express";
import {
  createTimetable,
  deleteTimetable,
  getMyTimetable,
  getTimetable,
  updateTimetable
} from "../controllers/timetableController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorizeRoles("student"), getMyTimetable);
router.get("/", protect, getTimetable);
router.post("/", protect, authorizeRoles("admin"), createTimetable);
router.put("/:id", protect, authorizeRoles("admin"), updateTimetable);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTimetable);

export default router;
