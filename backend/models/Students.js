import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    cfHandle: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0 },
    rank: { type: String, default: "unrated" },
    streak: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    maxRating: { type: Number, default: 0 },
    maxRank: { type: String, default: "unrated" },
    contribution: { type: Number, default: 0 },
    inactivityReminderCount: { type: Number, default: 0 },
    autoEmailDisabled: { type: Boolean, default: false },
    lastSubmissionDate: { type: Date }, 
  },
  { timestamps: true }
);

export default mongoose.models.Students ||
  mongoose.model("Students", studentSchema);

