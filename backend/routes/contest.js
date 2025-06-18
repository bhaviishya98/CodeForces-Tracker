import express from "express";
import ContestHistory from "../models/ContestHistory.js"; 
import SolvedProblem from "../models/SolvedProblem.js";

const router = express.Router();

router.get("/contests/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const days = parseInt(req.query.days) || 30;

    if (!studentId) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const contests = await ContestHistory.find({
      student: studentId,
      date: { $gte: fromDate },
    }).sort({ date: -1 });

    res.status(200).json(contests);
  } catch (error) {
    console.error("Error fetching contest history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/contests/problemSolving/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const days = parseInt(req.query.days) || 30;

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const problems = await SolvedProblem.find({
      student: studentId,
      timestamp: { $gte: fromDate },
    });

    if (!problems.length)
      return res.json({ message: "No problem solving data found", data: [] });

    let totalSolved = problems.length;
    let totalRating = 0;
    let ratingBuckets = {};
    let mostDifficultRating = 0;
    let mostDifficultProblems = [];
    let dateMap = {};

    problems.forEach((problem) => {
      // Avg rating calc
      if (problem.rating) {
        totalRating += problem.rating;
        ratingBuckets[problem.rating] =
          (ratingBuckets[problem.rating] || 0) + 1;

        if (problem.rating > mostDifficultRating) {
          mostDifficultRating = problem.rating;
          mostDifficultProblems = [problem];
        } else if (problem.rating === mostDifficultRating) {
          mostDifficultProblems.push(problem);
        }
      }

      // Heatmap
      const dateKey = new Date(problem.timestamp).toISOString().split("T")[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });

    res.json({
      totalSolved,
      averageRating: totalSolved ? (totalRating / totalSolved).toFixed(2) : 0,
      averagePerDay: (totalSolved / days).toFixed(2),
      ratingBuckets,
      mostDifficultProblems: mostDifficultProblems.map((p) => ({
        name: p.name,
        rating: p.rating,
        contestId: p.contestId,
        index: p.index,
      })),
      heatmap: dateMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Problem fetching problem-solving data" });
  }
});



export default router;
