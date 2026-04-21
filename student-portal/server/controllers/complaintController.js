import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required." });
    }

    const created = await Complaint.create({
      student: req.user._id,
      title,
      description
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
