const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/loginController');
const { isAuthenticated } = require('../Middleware/auth'); // session auth middleware

// Login route
router.post('/', loginController.login);

// routes/employeeRoutes.js
router.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.json({ valid: true, userId: req.session.userId, username: req.session.username });
  } else {
    res.status(401).json({ valid: false, message: 'Session expired or invalid' });
  }
});


// Example protected route
router.get('/profile', isAuthenticated, (req, res) => {
  res.json({
    message: `Hello ${req.session.username}, this is your profile.`,
    userId: req.session.userId,
    sessionID: req.sessionID,
    expiresIn: req.session.cookie.maxAge
  });
});

module.exports = router;
