import crypto from "crypto";

export const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

export const hashOtpCode = (otpCode) => crypto.createHash("sha256").update(otpCode).digest("hex");

export const normalizeEmail = (email = "") => email.trim().toLowerCase();
