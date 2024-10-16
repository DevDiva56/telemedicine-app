const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to ensure the patient is logged in
function isPatient(req, res, next) {
    if (!req.session.patientId) {
        return res.status(403).json({ error: 'Please log in as a patient to book an appointment' });
    }
    next();
}

// Patient: Book an appointment
router.post('/book', isPatient, async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.session.patientId;

    try {
        const [result] = await db.execute(
            `INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) 
            VALUES (?, ?, ?, ?, 'scheduled')`,
            [patient_id, doctor_id, appointment_date, appointment_time]
        );
        res.status(201).json({ message: 'Appointment booked successfully!', appointmentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to book appointment: ' + err.message });
    }
});

// Patient: View upcoming appointments
router.get('/my-appointments', isPatient, async (req, res) => {
  const patient_id = req.session.patientId;

  try {
      const [rows] = await db.execute(
          `SELECT Appointments.id, Doctors.first_name, Doctors.last_name, Appointments.appointment_date, Appointments.appointment_time, Appointments.status
          FROM Appointments
          JOIN Doctors ON Appointments.doctor_id = Doctors.id
          WHERE Appointments.patient_id = ? AND Appointments.status = 'scheduled'`,
          [patient_id]
      );
      res.json(rows);
  } catch (err) {
      res.status(500).json({ error: 'Error fetching appointments: ' + err.message });
  }
});

// Patient: Cancel an appointment
router.put('/cancel/:id', isPatient, async (req, res) => {
  const { id } = req.params;
  
  try {
      await db.execute(
          `UPDATE Appointments SET status = 'canceled' WHERE id = ?`,
          [id]
      );
      res.json({ message: 'Appointment canceled successfully!' });
  } catch (err) {
      res.status(500).json({ error: 'Error canceling appointment: ' + err.message });
  }
});


module.exports = router;