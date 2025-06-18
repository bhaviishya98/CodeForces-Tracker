import axios from "axios";
import SolvedProblem from "../models/SolvedProblem.js";

async function updateSolvedProblems(cfHandle, studentId) {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.status?handle=${cfHandle}`
    );

    if (res.data.status !== "OK") return;

    const submissions = res.data.result;

    const solvedSet = new Set();
    const attemptedSet = new Set();
    const newSolvedProblems = [];

    for (let sub of submissions) {
      if (!sub.problem || !sub.verdict) continue;

      const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
      attemptedSet.add(problemKey);

      if (sub.verdict === "OK" && !solvedSet.has(problemKey)) {
        solvedSet.add(problemKey);

        const timestamp = new Date(sub.creationTimeSeconds * 1000);

        newSolvedProblems.push({
          student: studentId,
          contestId: sub.problem.contestId || null,
          index: sub.problem.index,
          name: sub.problem.name,
          rating: sub.problem.rating || null,
          timestamp,
          tags: sub.problem.tags || [],
          source: sub.author?.contestId ? "contest" : "practice",
        });
      }
    }

    // Save all solved problems to DB (skip duplicates)
    const bulkOps = newSolvedProblems.map((p) => ({
      updateOne: {
        filter: {
          student: p.student,
          contestId: p.contestId,
          index: p.index,
        },
        update: { $setOnInsert: p },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await SolvedProblem.bulkWrite(bulkOps);
    }

    
  } catch (err) {
    console.error("Failed to update solved problems:", err.message);
  }
}

export default updateSolvedProblems;
