import express from "express";
import { createAdmin, getMe, listStudents, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);
router.get("/me", protect, getMe);
router.get("/students", protect, authorizeRoles("admin"), listStudents);

export default router;
