import axios from "axios";
import SolvedProblem from "../models/SolvedProblem.js";

async function updateSolvedProblems(cfHandle, studentId, shouldSave = true) {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.status?handle=${cfHandle}`
    );

    if (res.data.status !== "OK") return;

    const submissions = res.data.result;

    console.log(`🔍 Found ${submissions.length} submissions for ${cfHandle}`);

    // 🔍 Get already saved problems
    const existing = await SolvedProblem.find({ student: studentId });

    console.log(`🔍 Found ${existing.length} existing solved problems`);
    

    const existingProblemKeys = new Set(
      existing.map((p) => `${p.contestId}-${p.index}-${p.name}`)
    );

    console.log(`🔍 Existing problem keys: ${existingProblemKeys.size}`);
    

    const filteredNew = submissions.filter(
      (sub) =>
        !existingProblemKeys.has(
          `${sub.problem.contestId}-${sub.problem.index}-${sub.problem.name}`
        )
    );

    console.log(`🔍 Filtered new submissions: ${filteredNew.length}`);

    if (filteredNew.length === 0) return;

    console.log(`🔍 Processing ${filteredNew.length} new submissions...`);
    
    const solvedSet = new Set();
    const newSolvedProblems = [];

    for (const sub of submissions) {
      if (!sub.problem || !sub.verdict || sub.verdict !== "OK") continue;

      const contestId = sub.problem.contestId || "virtual";
      const problemKey = `${contestId}-${sub.problem.index}-${sub.problem.name}`;

      if (solvedSet.has(problemKey) || existingProblemKeys.has(problemKey)) {
        continue;
      } else {
        solvedSet.add(problemKey);
      }

      const timestamp = new Date(sub.creationTimeSeconds * 1000);

      // console.log(`🔍 Adding solved problem: ${sub.problem.name} (${contestId}-${sub.problem.index})`);
      

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
    console.log(`🔍 New solved problems to insert: ${newSolvedProblems.length}`);

    console.log("New solved problem: ", newSolvedProblems[0]);
    

    if (shouldSave && newSolvedProblems.length > 0) {
      console.log(`🔄 Saving ${newSolvedProblems.length} new solved problems...`);
      
      await SolvedProblem.insertMany(newSolvedProblems);
    } 
    
    return [...newSolvedProblems];
    
  } catch (err) {
    console.error("❌ Failed to update solved problems:", err.message);
    return [];
  }
}

export default updateSolvedProblems;
