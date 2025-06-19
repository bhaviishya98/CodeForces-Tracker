import axios from "axios";
import fetchCodeforcesHistory from "./fetchCodeforcesHistory.js";
import fetchUnsolvedProblems from "./fetchUnsolvedProblems.js";

const fetchCodeforcesInfo = async (handle, studentId) => {
  try {
    // Fetch user profile data
    const profileRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const user = profileRes.data.result[0];

    // Fetch contest history
    const contestHistory =
      (await fetchCodeforcesHistory(handle, studentId, false)) || [];

    // Fetch solved problems
    const solvedProblems =
      (await fetchUnsolvedProblems(handle, studentId, false)) || [];

    // Return a full object
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "",
      maxRank: user.maxRank || "",
      contribution: user.contribution || 0,
      contestHistory,
      solvedProblems,
    };
  } catch (err) {
    console.error("❌ Failed to fetch Codeforces info:", err.message);
    return null;
  }
};

export default fetchCodeforcesInfo;
