const express = require('express');
const router = express.Router();

const {
  createStripeSession,
  handleWebhook
} = require('../controllers/paymentController');

const authMiddleware = require('../middleware/auth');

// Create a Stripe checkout session (protected)
router.post('/create-session', authMiddleware, createStripeSession);

// Stripe webhook (no auth — Stripe calls this directly)
// NOTE: This route needs raw body for signature verification.
// It's mounted with express.raw() in server.js
router.post('/webhook', handleWebhook);

module.exports = router;
