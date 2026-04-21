import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaint
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), createComplaint);
router.get("/my", protect, authorizeRoles("student"), getMyComplaints);
router.get("/", protect, authorizeRoles("admin"), getAllComplaints);
router.put("/:id", protect, authorizeRoles("admin"), updateComplaint);

export default router;
