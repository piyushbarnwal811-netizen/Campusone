import mongoose from "mongoose";

const onlineExamAccessSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    canAttempt: {
      type: Boolean,
      default: true
    },
    totalAttempts: {
      type: Number,
      default: 0
    },
    lastSubmission: {
      submittedAt: Date,
      score: Number,
      totalQuestions: Number,
      attemptedCount: Number,
      reason: String
    },
    lastGrantedAt: Date,
    lastGrantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const OnlineExamAccess = mongoose.model("OnlineExamAccess", onlineExamAccessSchema);

export default OnlineExamAccess;
