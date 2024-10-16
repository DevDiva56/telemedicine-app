const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Patient Registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute(
            `INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );
        res.status(201).json({ message: 'Patient registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Patient Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const [rows] = await db.execute('SELECT * FROM Patients WHERE email = ?', [email]);

      if (rows.length === 0) {
          return res.status(400).json({ error: 'User not found' });
      }

      const patient = rows[0];

      // Compare passwords
      const match = await bcrypt.compare(password, patient.password_hash);
      if (!match) {
          return res.status(400).json({ error: 'Incorrect password' });
      }

      // Start session
      req.session.patientId = patient.id;
      res.json({ message: 'Login successful', patient });
  } catch (err) {
      res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// View Profile (must be logged in)
router.get('/profile', async (req, res) => {
  if (!req.session.patientId) {
      return res.status(403).json({ error: 'Please log in first' });
  }

  try {
      const [rows] = await db.execute('SELECT * FROM Patients WHERE id = ?', [req.session.patientId]);
      res.json(rows[0]);
  } catch (err) {
      res.status(500).json({ error: 'Database error: ' + err.message });
  }
});


// Update Profile
router.put('/profile', async (req, res) => {
  if (!req.session.patientId) {
      return res.status(403).json({ error: 'Please log in first' });
  }

  const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;

  try {
      await db.execute(
          `UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? 
          WHERE id = ?`,
          [first_name, last_name, phone, date_of_birth, gender, address, req.session.patientId]
      );
      res.json({ message: 'Profile updated successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

module.exports = router;

