const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  verifyRegistrationCode, 
  enableMFA, 
  verifyMFA 
} = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-registration', verifyRegistrationCode);

// Protected endpoints (Require standard login JWT)
router.post('/mfa/enable', authMiddleware, enableMFA);
router.post('/mfa/verify', authMiddleware, verifyMFA);

module.exports = router;