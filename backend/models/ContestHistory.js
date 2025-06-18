// models/ContestHistory.js
import mongoose from "mongoose";

const contestHistorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    contestId: Number,
    contestName: String,
    rank: Number,
    oldRating: Number,
    newRating: Number,
    change: Number,
    date: Date,

    unsolvedProblems: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContestHistory ||
  mongoose.model("ContestHistory", contestHistorySchema);
