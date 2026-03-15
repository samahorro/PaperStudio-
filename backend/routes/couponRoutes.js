const express = require('express');
const router = express.Router();

const {
  validateCoupon,
  createCoupon,
  getAllCoupons
} = require('../controllers/couponController');

const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validateCouponCode, validateCreateCoupon } = require('../middleware/validate');

// Customer endpoint — validate coupon before checkout
router.post('/validate', authMiddleware, validateCouponCode, validateCoupon);

// Admin endpoints
router.post('/', authMiddleware, adminAuth, validateCreateCoupon, createCoupon);
router.get('/', authMiddleware, adminAuth, getAllCoupons);

module.exports = router;
