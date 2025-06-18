import express from "express";
import Students from "../models/Students.js";
import ContestHistory from "../models/ContestHistory.js";
import SolvedProblem from "../models/SolvedProblem.js";
import updateContestHistory from "../utils/fetchCodeforcesHistory.js";
import updateUnsolvedProblems from "../utils/fetchUnsolvedProblems.js";


const router = express.Router();

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

    const newStudent = new Students({
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

    const updated = await Students.findByIdAndUpdate(studentId, req.body, {
      new: true,
    });

    if (prevHandle !== newHandle) {
      await ContestHistory.deleteMany({ student: studentId });

      // 🔄 Re-fetch and store new contest data
      await updateContestHistory(newHandle, studentId);
      await updateUnsolvedProblems(newHandle, studentId);
    }

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
