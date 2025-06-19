import axios from "axios";
import SolvedProblem from "../models/SolvedProblem.js";

async function updateSolvedProblems(cfHandle, studentId, shouldSave = true) {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.status?handle=${cfHandle}`
    );

    if (res.data.status !== "OK") return [];

    const submissions = res.data.result;

    // 🔍 Get already saved problems
    const existing = await SolvedProblem.find({ student: studentId });
    const existingProblemKeys = new Set(
      existing.map((p) => `${p.contestId}-${p.index}`)
    );

    const solvedSet = new Set();
    const newSolvedProblems = [];

    for (const sub of submissions) {
      if (!sub.problem || !sub.verdict || sub.verdict !== "OK") continue;

      const contestId = sub.problem.contestId || "virtual";
      const problemKey = `${contestId}-${sub.problem.index}`;

      if (solvedSet.has(problemKey) || existingProblemKeys.has(problemKey))
        continue;

      solvedSet.add(problemKey);

      const timestamp = new Date(sub.creationTimeSeconds * 1000);

      newSolvedProblems.push({
        student: studentId,
        contestId,
        index: sub.problem.index,
        name: sub.problem.name,
        rating: sub.problem.rating || null,
        timestamp,
        tags: sub.problem.tags || [],
        source: sub.author?.contestId ? "contest" : "practice",
      });
    }

    if (shouldSave && newSolvedProblems.length > 0) {
      await SolvedProblem.insertMany(newSolvedProblems);
    }

    return [...existing, ...newSolvedProblems];
  } catch (err) {
    console.error("❌ Failed to update solved problems:", err.message);
    return [];
  }
}

export default updateSolvedProblems;
