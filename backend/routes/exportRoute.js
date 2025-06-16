import express from "express";
import Students from "../models/Students.js";


const router = express.Router();

// @route   GET /api/students/export
router.get("/export", async (req, res) => {
  try {
    const students = await Students.find().lean();
      const format = req.query.format || "json";
      
      console.log("Exporting students in format:", format);
      

    if (format === "csv") {
      const fields = [
        "name",
        "email",
        "phone",
        "cfHandle",
        "rating",
        "maxRating",
        "rank",
        "maxRank",
        "contribution",
        "streak",
        "status",
        "favorite",
        "createdAt",
        "updatedAt",
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(students);

      res.header("Content-Type", "text/csv");
      res.attachment("students.csv");
      return res.send(csv);
    } else {
      // Default JSON
      return res.json(students);
    }
  } catch (error) {
    console.error("Export error:", error.message);
    res.status(500).json({ error: "Failed to export student data" });
  }
});

export default router;
