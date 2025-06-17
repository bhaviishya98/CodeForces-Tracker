// server.js or routes/contest.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get('/contests/:handle', async (req, res) => {
  const { handle } = req.params;

  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );

    const contestData = response.data.result;

    // Optional: Format it if needed
    const formatted = contestData.map((c) => ({
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      change: c.newRating - c.oldRating,
      date: new Date(c.ratingUpdateTimeSeconds * 1000),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch contest data:", err.message);
    res.status(500).json({ error: "Failed to fetch contest data" });
  }
});

router.get("/contests/unsolvedProblem/:handle", async (req, res) => {
  const { handle } = req.params;

  try {
    // 1. Get user's contest history
    const { data: contestRes } = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const contests = contestRes.result;

    // 2. Get user's submissions
    const { data: subRes } = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
    );
    const submissions = subRes.result;

    // 3. Mark solved problems
    const solved = new Set();
    for (const sub of submissions) {
      if (sub.verdict === "OK") {
        const key = `${sub.contestId}-${sub.problem.index}`;
        solved.add(key);
      }
    }

    // 4. Estimate unsolved problems (A–E assumed)
    const allIndexes = ["A", "B", "C", "D", "E"];
    const contestUnsolved = contests.map((contest) => {
      const unsolved = allIndexes.reduce((count, index) => {
        const key = `${contest.contestId}-${index}`;
        return solved.has(key) ? count : count + 1;
      }, 0);

      return {
        contestId: contest.contestId,
        unsolvedProblems: unsolved,
      };
    });

    res.json(contestUnsolved);
  } catch (error) {
    console.error("Error in /unsolved/:handle", error.message);
    res.status(500).json({ error: "Failed to fetch unsolved problems." });
  }
});

export default router;
