import Timetable from "../models/Timetable.js";

export const createTimetable = async (req, res) => {
  try {
    const created = await Timetable.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTimetable = async (req, res) => {
  try {
    const list = await Timetable.find().sort({ day: 1, startTime: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyTimetable = async (req, res) => {
  try {
    const filter = {
      department: req.user.department,
      semester: req.user.semester
    };

    const list = await Timetable.find(filter).sort({ day: 1, startTime: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTimetable = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Timetable entry not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Timetable entry not found." });
    }

    return res.json({ message: "Timetable entry deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
