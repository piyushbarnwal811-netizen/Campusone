import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, subject, status } = req.body;

    if (!studentId || !date || !subject || !status) {
      return res.status(400).json({ message: "studentId, date, subject and status are required." });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date: new Date(date), subject },
      {
        student: studentId,
        date: new Date(date),
        subject,
        status,
        markedBy: req.user._id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json(attendance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id })
      .sort({ date: -1 })
      .populate("markedBy", "name");

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.query;
    const filter = {};

    if (studentId) {
      filter.student = studentId;
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .populate("student", "name rollNo department semester")
      .populate("markedBy", "name");

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Attendance.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res.json({ message: "Attendance deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
