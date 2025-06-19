import Students from "../models/Students.js";
import ContestHistory from "../models/ContestHistory.js";
import SolvedProblem from "../models/SolvedProblem.js";
import fetchCodeforcesInfo from "../utils/fetchCodeforcesInfo.js";

const syncCodeforcesData = async () => {
  try {
    console.log("🟡 Starting Codeforces data sync...");
    const students = await Students.find({});

    console.log(`🔍 Found ${students.length} students to sync...`);

    for (const student of students) {
      const handle = student.cfHandle;
      const studentId = student._id;

      console.log(`🔍 Processing student: ${student.name} (${studentId})`);

      if (!handle) continue;

      console.log(`🔄 Syncing ${student.name} (${handle})...`);

      const cfData = await fetchCodeforcesInfo(handle, studentId);

      if (!cfData || !cfData.rating) {
        console.warn(
          `⚠️ Skipping ${student.name} due to missing or invalid data`
        );
        continue;
      }

      // ✅ Update student ratings and core info
      student.rating = cfData.rating;
      student.maxRating = cfData.maxRating;
      student.rank = cfData.rank;
      student.maxRank = cfData.maxRank;
      student.contribution = cfData.contribution;
      student.updatedAt = new Date();

      await student.save();

      // ✅ Update contest history if present
      if (cfData.contestHistory?.length > 0) {
        const contestDocs = cfData.contestHistory.map((entry) => ({
          ...entry,
          student: studentId,
        }));
        await ContestHistory.insertMany(contestDocs);
        console.log(`📊 Updated ${contestDocs.length} contests`);
      } else {
        console.log(`ℹ️ No new contests for ${student.name}`);
      }

      // ✅ Update solved problems if present
      if (cfData.solvedProblems?.length > 0) {
        const problemDocs = cfData.solvedProblems
          .filter((p) => typeof p.contestId === "number") // ✅ Prevent DB errors
          .map((entry) => ({
            ...entry,
            student: studentId,
          }));

        await SolvedProblem.insertMany(problemDocs);
        console.log(`✅ Inserted ${problemDocs.length} solved problems`);
      } else {
        console.log(`ℹ️ No new solved problems for ${student.name}`);
      }

      console.log(`✅ Finished syncing ${student.name}`);
    }

    console.log("🟢 All students synced successfully.");
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
};

export default syncCodeforcesData;
