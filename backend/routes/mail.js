import express from "express";
import Students from "../models/Students.js";
import checkAndSendInactivityReminder from "../utils/checkAndSendInactivityReminder.js";

const router = express.Router();

router.post("/inactivity-check", async (req, res) => {
  try {
    const students = await Students.find({
      lastSubmissionDate: { $exists: true },
      autoEmailDisabled: false,
    });

    const now = Date.now();
    let emailsSent = 0;

    for (const student of students) {
      const last = student.lastSubmissionDate;

      if (!last) continue;

      const daysSinceLast =
        (now - new Date(last).getTime()) / (1000 * 60 * 60 * 24);

      const inactive = daysSinceLast >= 7;

      if (inactive) {
        await checkAndSendInactivityReminder(student, last);
        await student.save();
        emailsSent++;
      }
    }

    res.status(200).json({ message: `✅ Sent ${emailsSent} reminder(s).` });
  } catch (err) {
    console.error("❌ Inactivity check failed:", err.message);
    res.status(500).json({ error: "Inactivity check failed" });
  }
});

export default router;
