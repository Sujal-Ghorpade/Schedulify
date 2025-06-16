const express = require("express");
const db = require("../models/db");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const router = express.Router();

// GET reminders - only user's + hide expired
router.get("/reminders", isAuthenticated, async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM reminders WHERE student_id = ? AND due_date >= NOW() ORDER BY due_date",
    [req.session.studentId]
  );
  res.render("reminders", { reminders: rows });
});

// POST add reminder
router.post("/reminders/add", isAuthenticated, async (req, res) => {
  const { title, due_date } = req.body;
  const dueDateTime = `${due_date} 23:59:59`;
  await db.execute(
    "INSERT INTO reminders (student_id, title, due_date) VALUES (?, ?, ?)",
    [req.session.studentId, title, dueDateTime]
  );
  res.redirect("/reminders");
});

// POST delete reminder (only by owner)
router.post("/reminders/delete/:id", isAuthenticated, async (req, res) => {
  const reminderId = req.params.id;
  await db.execute("DELETE FROM reminders WHERE id = ? AND student_id = ?", [
    reminderId,
    req.session.studentId,
  ]);
  res.redirect("/reminders");
});

module.exports = router;
