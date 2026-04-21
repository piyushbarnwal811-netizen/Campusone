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
router.get("/", protect, authorizeRoles("admin"), getNotices);
router.post("/", protect, authorizeRoles("admin"), createNotice);
router.put("/:id", protect, authorizeRoles("admin"), updateNotice);
router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

export default router;
