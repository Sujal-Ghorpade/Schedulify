const express = require("express");
const db = require("../models/db");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const router = express.Router();

// GET timetable - only student's
router.get("/timetable", isAuthenticated, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM timetable WHERE student_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), start_time',
    [req.session.studentId]
  );
  res.render("timetable", { timetable: rows });
});

// POST add timetable entry
router.post("/timetable/add", isAuthenticated, async (req, res) => {
  const { day, subject, start_time, end_time } = req.body;
  await db.execute(
    "INSERT INTO timetable (student_id, day, subject, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
    [req.session.studentId, day, subject, start_time, end_time]
  );
  res.redirect("/timetable");
});

// POST delete timetable entry (only by owner)
router.post("/timetable/delete/:id", isAuthenticated, async (req, res) => {
  const timetableId = req.params.id;
  await db.execute("DELETE FROM timetable WHERE id = ? AND student_id = ?", [
    timetableId,
    req.session.studentId,
  ]);
  res.redirect("/timetable");
});

module.exports = router;
