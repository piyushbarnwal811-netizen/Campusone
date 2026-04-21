import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending"
    },
    response: {
      type: String,
      trim: true,
      default: ""
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
