const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const remindersRoutes = require("./routes/reminders");
const { isAuthenticated } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(authRoutes);
app.use(timetableRoutes);
app.use(remindersRoutes);

app.get("/", (req, res) => res.redirect("/login"));

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { name: req.session.studentName });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

require("./scheduler");
