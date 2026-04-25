import Complaint from "../models/Complaint.js";
import { COMPLAINT_DEPARTMENTS } from "../constants/complaintDepartments.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description, targetDepartment } = req.body;

    if (!title || !description || !targetDepartment) {
      return res.status(400).json({ message: "title, description and targetDepartment are required." });
    }

    if (!COMPLAINT_DEPARTMENTS.includes(targetDepartment)) {
      return res.status(400).json({ message: "Invalid targetDepartment selected." });
    }

    const created = await Complaint.create({
      student: req.user._id,
      title,
      description,
      targetDepartment
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate("resolvedBy", "name");

    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate("student", "name email rollNo department semester")
      .populate("resolvedBy", "name");

    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.status === "resolved") {
      updates.resolvedBy = req.user._id;
    }

    const updated = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("student", "name")
      .populate("resolvedBy", "name");

    if (!updated) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
