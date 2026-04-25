import express from "express";
import {
  getMyOnlineExamStatus,
  submitOnlineExam,
  getOnlineExamPermissions,
  grantOnlineExamPermission
} from "../controllers/onlineExamController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/status", protect, authorizeRoles("student"), getMyOnlineExamStatus);
router.post("/submit", protect, authorizeRoles("student"), submitOnlineExam);
router.get("/admin/permissions", protect, authorizeRoles("admin"), getOnlineExamPermissions);
router.put("/admin/grant/:studentId", protect, authorizeRoles("admin"), grantOnlineExamPermission);

export default router;
