const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

// Register GET
router.get('/register', (req, res) => {
  res.render('register');
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO students (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    res.redirect('/login');
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).send('Server Error during registration.');
  }
});

// Login GET
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    if (rows.length > 0) {
      const valid = await bcrypt.compare(password, rows[0].password);
      if (valid) {
        req.session.studentId = rows[0].id;
        req.session.studentName = rows[0].name;
        return res.redirect('/dashboard');
      }
    }
    res.redirect('/login');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Server Error during login.');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
