import Exam from "../models/Exam.js";

export const createExam = async (req, res) => {
  try {
    const created = await Exam.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      department: req.user.department,
      semester: req.user.semester
    }).sort({ date: 1 });

    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Exam not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Exam not found." });
    }

    return res.json({ message: "Exam deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
