const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadProductAndImage, getAllProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Configure Multer to keep the file in memory (RAM) instead of writing it to disk.
// This is required because we need to stream the buffer directly to AWS S3.
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: limit image size to 5MB
});

// Public endpoint to view products
router.get('/', getAllProducts);

// Protected Admin Endpoint for creating new products with photo uploads
// 'image' is the matching field name the frontend will use in the FormData
router.post('/', authMiddleware, upload.single('image'), uploadProductAndImage);

module.exports = router;
