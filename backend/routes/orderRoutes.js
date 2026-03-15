const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validateCheckout } = require('../middleware/validate');

// Customer endpoints (protected)
router.post('/checkout', authMiddleware, validateCheckout, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin endpoints
router.put('/:id/status', authMiddleware, adminAuth, updateOrderStatus);

module.exports = router;
