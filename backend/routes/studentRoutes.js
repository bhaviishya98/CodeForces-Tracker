import express from "express";
import Students from "../models/Students.js";
import ContestHistory from "../models/ContestHistory.js";
import SolvedProblem from "../models/SolvedProblem.js";
import updateContestHistory from "../utils/fetchCodeforcesHistory.js";
import updateUnsolvedProblems from "../utils/fetchUnsolvedProblems.js";
import fetchCodeforcesInfo from "../utils/fetchCodeforcesInfo.js";

const router = express.Router();

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

router.post("/students", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cfHandle,
      rating,
      maxRating,
      rank,
      maxRank,
      streak,
      status,
      contribution,
    } = req.body;

    const existingStudent = await Students.findOne({ cfHandle });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const cfData = await fetchCodeforcesInfo(cfHandle);

    if (!cfData || !cfData.rating) {
      return res
        .status(400)
        .json({ message: "Invalid Codeforces handle or data unavailable" });
    }

    // Get latest submission date (assumes sorted descending)
    let lastSubmissionDate = null;
    console.log("latest problem", cfData.solvedProblems[0]);

    if (cfData.solvedProblems?.length > 0) {
      lastSubmissionDate = new Date(cfData.solvedProblems[0].timestamp);
    }

    // Determine status based on activity
    const now = Date.now();
    const isInactive =
      lastSubmissionDate && now - lastSubmissionDate.getTime() > SEVEN_DAYS_MS;

    console.log("lastSubmissionDate:", lastSubmissionDate.toISOString());
    console.log("isInactive:", isInactive);

    const newStudent = new Students({
      name,
      email,
      phone,
      cfHandle,
      rating: cfData.rating,
      maxRating: cfData.maxRating,
      rank: cfData.rank,
      maxRank: cfData.maxRank,
      streak,
      status: isInactive ? "inactive" : status || "active",
      contribution: cfData.contribution || contribution || 0,
      lastSubmissionDate,
      inactivityReminderCount: 0,
      autoEmailDisabled: false,
    });

    const savedStudent = await newStudent.save();

    // ⏳ Defer contest & problem data fetching to utilities
    await Promise.all([
      updateContestHistory(cfHandle, savedStudent._id),
      updateUnsolvedProblems(cfHandle, savedStudent._id),
    ]);

    res.status(201).json({ message: "Student created and data synced." });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/students", async (req, res) => {
  try {
    const students = await Students.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const newHandle = req.body.cfHandle;

    const existingStudent = await Students.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    const prevHandle = existingStudent.cfHandle;

    let lastSubmissionDate = existingStudent.lastSubmissionDate;
    let status = req.body.status || existingStudent.status;
    let contribution = req.body.contribution;

    // If handle changed or rating-related fields are being updated
    let cfData = null;
    if (prevHandle !== newHandle) {
      cfData = await fetchCodeforcesInfo(newHandle);

      if (!cfData || !cfData.rating) {
        return res
          .status(400)
          .json({ error: "Invalid or inaccessible Codeforces data" });
      }

      // Detect most recent submission
      const latest = cfData.solvedProblems?.[0]?.timestamp;
      if (latest) {
        lastSubmissionDate =
          typeof latest === "number" && latest < 1e12
            ? new Date(latest * 1000)
            : new Date(latest);
      }

      // Detect inactivity
      const now = Date.now();
      const isInactive =
        lastSubmissionDate &&
        now - lastSubmissionDate.getTime() > SEVEN_DAYS_MS;

      status = isInactive ? "inactive" : "active";
      contribution = cfData.contribution || contribution || 0;

      // Replace all related contest/problem data
      await ContestHistory.deleteMany({ student: studentId });
      await SolvedProblem.deleteMany({ student: studentId });
      await updateContestHistory(newHandle, studentId);
      await updateUnsolvedProblems(newHandle, studentId);
    }

    const updated = await Students.findByIdAndUpdate(
      studentId,
      {
        ...req.body,
        lastSubmissionDate,
        status,
        contribution,
        rating: cfData?.rating || req.body.rating,
        maxRating: cfData?.maxRating || req.body.maxRating,
        rank: cfData?.rank || req.body.rank,
        maxRank: cfData?.maxRank || req.body.maxRank,
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});


router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Perform both deletions in parallel
    const [deletedStudent, deletedContests] = await Promise.all([
      Students.findByIdAndDelete(id),
      ContestHistory.deleteMany({ student: id }),
      SolvedProblem.deleteMany({ student: id }),
    ]);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(
      `Deleted student: ${id}, Contest records removed: ${deletedContests.deletedCount}`
    );

    res.status(200).json({
      message:
        "Student and all related contest/problem data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/students/:handle", async (req, res) => {
  try {
    const { handle } = req.params;
    const student = await Students.findOne({ cfHandle: handle });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
