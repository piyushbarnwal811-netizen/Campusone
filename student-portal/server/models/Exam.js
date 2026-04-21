import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      trim: true
    },
    maxMarks: {
      type: Number,
      default: 100
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
