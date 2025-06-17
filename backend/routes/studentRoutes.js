import express from 'express';
import Students from '../models/Students.js';

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

    // Check if student already exists
    const existingStudent = await Students.find({ cfHandle });
    if (existingStudent.length > 0) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Create new student with full schema fields
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

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get('/students', async (req, res) => {
    try {
        const students = await Students.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put("/students/:id", async (req, res) => {
  try {
    
    const updated = await Students.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Students.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/students/:handle', async (req, res) => {
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