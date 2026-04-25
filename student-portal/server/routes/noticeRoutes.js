import express from "express";
import {
  createNotice,
  deleteNotice,
  getNotices,
  getRoleBasedNotices,
  updateNotice
} from "../controllers/noticeController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, getRoleBasedNotices);
router.get("/", protect, authorizeRoles("admin", "faculty"), getNotices);
router.post("/", protect, authorizeRoles("admin", "faculty"), createNotice);
router.put("/:id", protect, authorizeRoles("admin", "faculty"), updateNotice);
router.delete("/:id", protect, authorizeRoles("admin", "faculty"), deleteNotice);

export default router;
