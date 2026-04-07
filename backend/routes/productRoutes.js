const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getAllProducts,
  getProductById,
  uploadProductAndImage,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validateProduct } = require('../middleware/validate');

// Configure Multer for memory storage (for S3 streaming)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Public endpoints
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin endpoints (protected)
router.post('/', authMiddleware, adminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hoverImage', maxCount: 1 }]), validateProduct, uploadProductAndImage);
router.put('/:id', authMiddleware, adminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hoverImage', maxCount: 1 }]), updateProduct);
router.delete('/:id', authMiddleware, adminAuth, deleteProduct);

module.exports = router;
