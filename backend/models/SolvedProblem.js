// models/SolvedProblem.js
import mongoose from "mongoose";

const solvedProblemSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    contestId: Number, // Optional, if it came from a contest
    index: String, // e.g., "A", "B", "C1"
    name: String,
    rating: Number,
    timestamp: Date, // When it was solved (for filtering)
    tags: [String], // Optional: topic tags
    source: {
      type: String,
      enum: ["contest", "practice"],
      default: "contest",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SolvedProblem ||
  mongoose.model("SolvedProblem", solvedProblemSchema);
