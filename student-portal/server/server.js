import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import onlineExamRoutes from "./routes/onlineExamRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import { seedDefaultUsers } from "./utils/seedDefaultUsers.js";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isLocalhostDev = /^http:\/\/localhost:\d+$/.test(origin);

      if (isExplicitlyAllowed || isLocalhostDev) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Student Portal API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/online-exam", onlineExamRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDefaultUsers();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
