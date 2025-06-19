// backend/routes/sync.js
import express from "express";
import syncCodeforcesData from "../cron/syncCodeforcesData.js";

const router = express.Router();

router.post("/sync", async (req, res) => {
  try {
    await syncCodeforcesData();
    res.status(200).json({ message: "Codeforces data synced successfully." });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Failed to sync data." });
  }
});

export default router;
