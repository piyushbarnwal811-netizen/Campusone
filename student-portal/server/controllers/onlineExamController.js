import OnlineExamAccess from "../models/OnlineExamAccess.js";
import User from "../models/User.js";

const getOrCreateAccess = async (studentId) => {
  let access = await OnlineExamAccess.findOne({ student: studentId });
  if (!access) {
    access = await OnlineExamAccess.create({ student: studentId, canAttempt: true });
  }
  return access;
};

export const getMyOnlineExamStatus = async (req, res) => {
  try {
    const access = await getOrCreateAccess(req.user._id);
    return res.json(access);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const submitOnlineExam = async (req, res) => {
  try {
    const { score = 0, totalQuestions = 0, attemptedCount = 0, reason = "Submitted by student." } = req.body;
    const access = await getOrCreateAccess(req.user._id);

    if (!access.canAttempt) {
      return res.status(403).json({ message: "Exam is locked. Wait for admin permission." });
    }

    access.canAttempt = false;
    access.totalAttempts += 1;
    access.lastSubmission = {
      submittedAt: new Date(),
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      attemptedCount: Number(attemptedCount),
      reason
    };

    await access.save();
    return res.json({ message: "Exam submitted and locked until admin grants permission.", access });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOnlineExamPermissions = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email rollNo department semester");
    const accesses = await OnlineExamAccess.find({
      student: { $in: students.map((student) => student._id) }
    }).select("student canAttempt totalAttempts lastSubmission lastGrantedAt");

    const accessMap = new Map(accesses.map((item) => [String(item.student), item]));
    const rows = students.map((student) => {
      const access = accessMap.get(String(student._id));
      return {
        student,
        canAttempt: access ? access.canAttempt : true,
        totalAttempts: access?.totalAttempts || 0,
        lastSubmission: access?.lastSubmission || null,
        lastGrantedAt: access?.lastGrantedAt || null
      };
    });

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const grantOnlineExamPermission = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.studentId, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const access = await OnlineExamAccess.findOneAndUpdate(
      { student: student._id },
      {
        $set: {
          canAttempt: true,
          lastGrantedAt: new Date(),
          lastGrantedBy: req.user._id
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: "Permission granted. Student can start exam again.", access });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
