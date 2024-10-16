// index.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db'); // Make sure this is your database connection file

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecretkey', // Use an environment variable for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set true in production with HTTPS
}));

// Routes
const patientsRouter = require('./routes/patients'); // Ensure this file exists
const doctorsRouter = require('./routes/doctors'); // Ensure this file exists
const appointmentsRouter = require('./routes/appointments'); // Ensure this file exists
const adminRouter = require('./routes/admin'); // Ensure this file exists

// Use the routers for specific endpoints
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/admin', adminRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
