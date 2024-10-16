const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to verify admin login
function isAdmin(req, res, next) {
    if (!req.session.adminId) {
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
}

// Add a new doctor (admin only)
router.post('/doctors', isAdmin, async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;

    try {
        const [result] = await db.execute(
            `INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, specialization, email, phone, schedule]
        );
        res.status(201).json({ message: 'Doctor added successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});


// Update doctor's schedule (admin or doctor can update)
router.put('/doctors/:id/schedule', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { schedule } = req.body;

    try {
        await db.execute(`UPDATE Doctors SET schedule = ? WHERE id = ?`, [schedule, id]);
        res.json({ message: 'Doctor schedule updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Get a list of all doctors (admin only)
router.get('/doctors', isAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Doctors');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Delete (deactivate) a doctor (admin only)
router.delete('/doctors/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await db.execute(`DELETE FROM Doctors WHERE id = ?`, [id]);
        res.json({ message: 'Doctor profile deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;