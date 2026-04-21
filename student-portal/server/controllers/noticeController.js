import Notice from "../models/Notice.js";

export const createNotice = async (req, res) => {
  try {
    const created = await Notice.create({ ...req.body, postedBy: req.user._id });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name role");

    return res.json(notices);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRoleBasedNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      audience: { $in: ["all", req.user.role] }
    })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name role");

    return res.json(notices);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Notice not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found." });
    }

    return res.json({ message: "Notice deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
