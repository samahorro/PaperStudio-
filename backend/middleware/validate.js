const { body, param, query, validationResult } = require('express-validator');

// ─── Validation Result Handler ──────────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// ─── Auth Validators ────────────────────────────────────

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  handleValidationErrors
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateForgotPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  handleValidationErrors
];

const validateResetPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('code').notEmpty().withMessage('Reset code is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidationErrors
];

// ─── Product Validators ─────────────────────────────────

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['notebooks', 'sketchbooks', 'calendars', 'pens', 'pencils', 'cases'])
    .withMessage('Invalid category'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors
];

// ─── Cart Validators ────────────────────────────────────

const validateAddToCart = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

const validateUpdateCartItem = [
  param('id').isUUID().withMessage('Valid cart item ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

// ─── Order Validators ───────────────────────────────────

const validateCheckout = [
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
  body('phone').optional().trim(),
  body('paymentMethod').optional().isIn(['card', 'paypal', 'apple_wallet'])
    .withMessage('Invalid payment method'),
  body('couponCode').optional().trim(),
  handleValidationErrors
];

// ─── Contact Validators ────────────────────────────────

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message too long (max 2000 characters)'),
  body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject too long'),
  handleValidationErrors
];

// ─── Coupon Validators ──────────────────────────────────

const validateCouponCode = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  handleValidationErrors
];

const validateCreateCoupon = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('discountType').isIn(['percent', 'fixed']).withMessage('Discount type must be percent or fixed'),
  body('discountValue').isFloat({ min: 0.01 }).withMessage('Discount value must be positive'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateProduct,
  validateAddToCart,
  validateUpdateCartItem,
  validateCheckout,
  validateContact,
  validateCouponCode,
  validateCreateCoupon
};
