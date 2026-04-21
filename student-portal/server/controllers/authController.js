import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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
    const { name, email, password, rollNo, department, semester } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      rollNo,
      department,
      semester
    });

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

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const user = await User.findOne({ email });
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

    if (secret !== process.env.JWT_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const admin = await User.create({ name, email, password, role: "admin" });

    return res.status(201).json({
      message: "Admin created.",
      token: generateToken(admin._id, admin.role),
      user: sanitizeUser(admin)
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
