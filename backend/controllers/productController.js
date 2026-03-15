const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const crypto = require('crypto');

// Configure S3 Client
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1'
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

const s3 = new S3Client(s3Config);

// ─── Get All Products (with filtering) ─────────────────

const getAllProducts = async (req, res) => {
  try {
    const { category, color, inStock, minPrice, maxPrice, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (color) where.color = { [Op.iLike]: `%${color}%` };
    if (inStock !== undefined) where.inStock = inStock === 'true';

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ─── Get Product By ID ─────────────────────────────────

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// ─── Create Product with S3 Image Upload ───────────────

const uploadProductAndImage = async (req, res) => {
  try {
    const { name, description, price, category, color, stock } = req.body;
    let imageUrl = null;

    if (req.file) {
      const BUCKET_NAME = process.env.S3_BUCKET_NAME;
      if (!BUCKET_NAME) {
        return res.status(500).json({ message: "S3_BUCKET_NAME environment variable is missing!" });
      }

      const fileExt = req.file.originalname.split('.').pop();
      const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;

      const params = {
        Bucket: BUCKET_NAME,
        Key: `products/${uniqueFilename}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category: category || 'notebooks',
      color: color || null,
      stock: stock ? parseInt(stock) : 0,
      imageUrl
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({ message: "Error uploading product", error: error.message });
  }
};

// ─── Update Product ────────────────────────────────────

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = ['name', 'description', 'price', 'category', 'color', 'stock', 'imageUrl'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = field === 'price' ? parseFloat(req.body[field])
          : field === 'stock' ? parseInt(req.body[field])
          : req.body[field];
      }
    }

    // Handle new image upload if provided
    if (req.file) {
      const BUCKET_NAME = process.env.S3_BUCKET_NAME;
      if (BUCKET_NAME) {
        const fileExt = req.file.originalname.split('.').pop();
        const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
        const params = {
          Bucket: BUCKET_NAME,
          Key: `products/${uniqueFilename}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        await s3.send(new PutObjectCommand(params));
        product.imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
      }
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// ─── Delete Product ────────────────────────────────────

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  uploadProductAndImage,
  updateProduct,
  deleteProduct
};
