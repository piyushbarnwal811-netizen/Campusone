import express from "express";
import {
  createAdmin,
  createFaculty,
  getMe,
  listStudents,
  loginUser,
  requestPasswordResetOtp,
  registerUser,
  resetPasswordWithOtp,
  requestRegisterOtp
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/request-otp", requestRegisterOtp);
router.post("/password/request-otp", requestPasswordResetOtp);
router.post("/password/reset", resetPasswordWithOtp);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);
router.post("/create-faculty", createFaculty);
router.get("/me", protect, getMe);
router.get("/students", protect, authorizeRoles("admin", "faculty"), listStudents);

export default router;
