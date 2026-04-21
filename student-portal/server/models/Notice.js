import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    audience: {
      type: String,
      enum: ["all", "student", "admin"],
      default: "all"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
