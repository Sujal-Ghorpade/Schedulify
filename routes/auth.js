const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO students (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
  if (rows.length > 0) {
    const valid = await bcrypt.compare(password, rows[0].password);
    if (valid) {
      req.session.studentId = rows[0].id;
      req.session.studentName = rows[0].name;
      return res.redirect('/dashboard');
    }
  }
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
