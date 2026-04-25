import EmailOtp from "../models/EmailOtp.js";
import User from "../models/User.js";
import { sendRegisterOtpEmail, sendResetPasswordOtpEmail } from "../utils/email.js";
import generateToken from "../utils/generateToken.js";
import { generateOtpCode, hashOtpCode, normalizeEmail } from "../utils/otp.js";

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  rollNo: user.rollNo,
  department: user.department,
  semester: user.semester
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp, rollNo, department, semester } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password || !otp || !department) {
      return res.status(400).json({ message: "name, email, password, otp and department are required." });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const otpDoc = await EmailOtp.findOne({ email: normalizedEmail, purpose: "register" });
    if (!otpDoc) {
      return res.status(400).json({ message: "Please request OTP first." });
    }

    if (otpDoc.expiresAt < new Date()) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    if (otpDoc.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many invalid OTP attempts. Request OTP again." });
    }

    const isOtpValid = otpDoc.otpHash === hashOtpCode(String(otp).trim());
    if (!isOtpValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "student",
      rollNo,
      department,
      semester
    });

    await EmailOtp.deleteOne({ _id: otpDoc._id });

    return res.status(201).json({
      message: "Registration successful.",
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json({
      message: "Login successful.",
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.json(req.user);
};

export const createAdmin = async (req, res) => {
  try {
    const { secret, name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (secret !== process.env.JWT_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret." });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const admin = await User.create({ name, email: normalizedEmail, password, role: "admin" });

    return res.status(201).json({
      message: "Admin created.",
      token: generateToken(admin._id, admin.role),
      user: sanitizeUser(admin)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const { secret, name, email, password, department } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const expectedSecret = process.env.FACULTY_SECRET || process.env.JWT_SECRET;

    if (secret !== expectedSecret) {
      return res.status(403).json({ message: "Invalid faculty secret." });
    }

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "name, email and password are required." });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const faculty = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "faculty",
      department
    });

    return res.status(201).json({
      message: "Faculty created.",
      token: generateToken(faculty._id, faculty.role),
      user: sanitizeUser(faculty)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const requestRegisterOtp = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "email is required." });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await EmailOtp.findOneAndUpdate(
      { email: normalizedEmail, purpose: "register" },
      {
        email: normalizedEmail,
        otpHash: hashOtpCode(otpCode),
        purpose: "register",
        attempts: 0,
        expiresAt
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emailResult = await sendRegisterOtpEmail({ to: normalizedEmail, otpCode });

    return res.json({
      message: emailResult.delivered
        ? "OTP sent to your email."
        : "OTP generated. Email service not configured, check server console.",
      expiresInMinutes: OTP_TTL_MINUTES
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "email is required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({
        message: "If this email is registered, OTP has been sent.",
        expiresInMinutes: OTP_TTL_MINUTES
      });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await EmailOtp.findOneAndUpdate(
      { email: normalizedEmail, purpose: "reset_password" },
      {
        email: normalizedEmail,
        otpHash: hashOtpCode(otpCode),
        purpose: "reset_password",
        attempts: 0,
        expiresAt
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emailResult = await sendResetPasswordOtpEmail({ to: normalizedEmail, otpCode });

    return res.json({
      message: emailResult.delivered
        ? "Password reset OTP sent to your email."
        : "OTP generated. Email service not configured, check server console.",
      expiresInMinutes: OTP_TTL_MINUTES
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const newPassword = req.body.newPassword;

    if (!normalizedEmail || !otp || !newPassword) {
      return res.status(400).json({ message: "email, otp and newPassword are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email." });
    }

    const otpDoc = await EmailOtp.findOne({ email: normalizedEmail, purpose: "reset_password" });
    if (!otpDoc) {
      return res.status(400).json({ message: "Please request OTP first." });
    }

    if (otpDoc.expiresAt < new Date()) {
      await EmailOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    if (otpDoc.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many invalid OTP attempts. Request OTP again." });
    }

    const isOtpValid = otpDoc.otpHash === hashOtpCode(otp);
    if (!isOtpValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.password = newPassword;
    await user.save();
    await EmailOtp.deleteOne({ _id: otpDoc._id });

    return res.json({ message: "Password reset successful. Please login with new password." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
