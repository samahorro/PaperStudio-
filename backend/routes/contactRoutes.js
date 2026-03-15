const express = require('express');
const router = express.Router();

const {
  submitContact,
  getAllMessages,
  updateMessageStatus
} = require('../controllers/contactController');

const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateContact } = require('../middleware/validate');

// Public endpoint (rate limited to prevent spam)
router.post('/', contactLimiter, validateContact, submitContact);

// Admin endpoints
router.get('/', authMiddleware, adminAuth, getAllMessages);
router.put('/:id', authMiddleware, adminAuth, updateMessageStatus);

module.exports = router;
