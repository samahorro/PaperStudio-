const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  verifyRegistrationCode, 
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  enableMFA, 
  verifyMFA 
} = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validate');

// Public endpoints (rate limited)
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/verify-registration', authLimiter, verifyRegistrationCode);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

// Protected endpoints
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/mfa/enable', authMiddleware, enableMFA);
router.post('/mfa/verify', authMiddleware, verifyMFA);

module.exports = router;