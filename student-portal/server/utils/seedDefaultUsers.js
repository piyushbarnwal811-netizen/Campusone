import User from "../models/User.js";
import { normalizeEmail } from "./otp.js";

const truthy = (value = "") => ["1", "true", "yes", "on"].includes(String(value).toLowerCase());

const createUserIfMissing = async ({ role, name, email, password, department }) => {
  const normalizedEmail = normalizeEmail(email);
  if (!name || !normalizedEmail || !password) {
    return;
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return;
  }

  await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    department
  });

  console.log(`[SEED] ${role} created: ${normalizedEmail}`);
};

export const seedDefaultUsers = async () => {
  if (!truthy(process.env.AUTO_SEED_USERS)) {
    return;
  }

  await createUserIfMissing({
    role: "admin",
    name: process.env.DEFAULT_ADMIN_NAME,
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: process.env.DEFAULT_ADMIN_PASSWORD
  });

  await createUserIfMissing({
    role: "faculty",
    name: process.env.DEFAULT_FACULTY_NAME,
    email: process.env.DEFAULT_FACULTY_EMAIL,
    password: process.env.DEFAULT_FACULTY_PASSWORD,
    department: process.env.DEFAULT_FACULTY_DEPARTMENT
  });
};
