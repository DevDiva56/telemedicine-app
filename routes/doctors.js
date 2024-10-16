const express = require('express');
const router = express.Router(); 

// Define routes for doctors 
router.post('/login', async (req, res) => {
  try {
    // Your logic for doctor login
    res.send('Doctor login successful');
  } catch (err) {
    res.status(500).send('Error logging in doctor');
  }
});

module.exports = router; // Export the router
