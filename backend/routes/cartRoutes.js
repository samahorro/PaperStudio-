const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/auth');
const { validateAddToCart, validateUpdateCartItem } = require('../middleware/validate');

// All cart routes require authentication
router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, validateAddToCart, addToCart);
router.put('/:id', authMiddleware, validateUpdateCartItem, updateCartItem);
router.delete('/:id', authMiddleware, removeCartItem);

module.exports = router;
