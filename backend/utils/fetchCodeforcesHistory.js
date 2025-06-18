import axios from "axios";
import ContestHistory from "../models/ContestHistory.js";

async function updateContestHistory(cfHandle, studentId) {
  try {
    const ratingRes = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${cfHandle}`
    );

    if (ratingRes.data.status !== "OK") return;

    const newContests = ratingRes.data.result;

    const existing = await ContestHistory.find({ student: studentId });
    const existingContestIds = new Set(existing.map((c) => c.contestId));

    const filteredNew = newContests.filter(
      (contest) => !existingContestIds.has(contest.contestId)
    );

    if (filteredNew.length === 0) return;

    // 🧠 Fetch all submissions once
    const statusRes = await axios.get(
      `https://codeforces.com/api/user.status?handle=${cfHandle}`
    );

    if (statusRes.data.status !== "OK") return;

    const submissions = statusRes.data.result;

    // 🔍 Build solved and attempted sets by contest
    const attemptedByContest = {};
    const solvedByContest = new Set();

    for (const sub of submissions) {
      if (!sub.problem || !sub.contestId || !sub.creationTimeSeconds) continue;

      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      const cid = sub.problem.contestId;

      if (!attemptedByContest[cid]) attemptedByContest[cid] = new Set();
      attemptedByContest[cid].add(key);

      if (sub.verdict === "OK") {
        solvedByContest.add(key);
      }
    }

    // ✍️ Format the contests to insert
    const formatted = filteredNew.map((c) => {
      const cid = c.contestId;
      const attempted = attemptedByContest[cid] || new Set();
      let unsolved = 0;

      for (const problemKey of attempted) {
        if (!solvedByContest.has(problemKey)) {
          unsolved++;
        }
      }

      return {
        contestId: c.contestId,
        contestName: c.contestName,
        rank: c.rank,
        oldRating: c.oldRating,
        newRating: c.newRating,
        change: c.newRating - c.oldRating,
        date: new Date(c.ratingUpdateTimeSeconds * 1000),
        student: studentId,
        unsolvedProblems: unsolved,
      };
    });

    

    await ContestHistory.insertMany(formatted);
  } catch (err) {
    console.error("Failed to update contest history:", err.message);
  }
}

export default updateContestHistory;
