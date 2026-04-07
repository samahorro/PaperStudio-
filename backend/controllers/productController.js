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
    const { category, color, inStock, minPrice, maxPrice, search, collectionName } = req.query;
    const where = {};

    if (category) where.category = category;
    if (collectionName) where.collectionName = collectionName;
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
    const { name, description, price, category, color, stock, isNewArrival, collectionName } = req.body;
    let imageUrl = null;
    let hoverImageUrl = null;

    if (req.files) {
      const BUCKET_NAME = process.env.S3_BUCKET_NAME;
      if (!BUCKET_NAME && (req.files['image'] || req.files['hoverImage'])) {
        return res.status(500).json({ message: "S3_BUCKET_NAME environment variable is missing!" });
      }

      if (req.files['image']) {
        const file = req.files['image'][0];
        const fileExt = file.originalname.split('.').pop();
        const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
        const params = { Bucket: BUCKET_NAME, Key: `products/${uniqueFilename}`, Body: file.buffer, ContentType: file.mimetype };
        await s3.send(new PutObjectCommand(params));
        imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
      }

      if (req.files['hoverImage']) {
        const file = req.files['hoverImage'][0];
        const fileExt = file.originalname.split('.').pop();
        const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
        const params = { Bucket: BUCKET_NAME, Key: `products/${uniqueFilename}`, Body: file.buffer, ContentType: file.mimetype };
        await s3.send(new PutObjectCommand(params));
        hoverImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category: category || 'notebooks',
      color: color || null,
      stock: stock ? parseInt(stock) : 0,
      imageUrl,
      hoverImageUrl,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      collectionName: collectionName || 'None'
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

    const allowedFields = ['name', 'description', 'price', 'category', 'color', 'stock', 'imageUrl', 'hoverImageUrl', 'isNewArrival', 'collectionName'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
         if (field === 'price') product[field] = parseFloat(req.body[field]);
         else if (field === 'stock') product[field] = parseInt(req.body[field]);
         else if (field === 'isNewArrival') product[field] = req.body[field] === 'true' || req.body[field] === true;
         else product[field] = req.body[field];
      }
    }

    // Handle new image uploads if provided
    if (req.files) {
      const BUCKET_NAME = process.env.S3_BUCKET_NAME;
      if (BUCKET_NAME) {
        if (req.files['image']) {
          const file = req.files['image'][0];
          const fileExt = file.originalname.split('.').pop();
          const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
          const params = { Bucket: BUCKET_NAME, Key: `products/${uniqueFilename}`, Body: file.buffer, ContentType: file.mimetype };
          await s3.send(new PutObjectCommand(params));
          product.imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
        }
        if (req.files['hoverImage']) {
          const file = req.files['hoverImage'][0];
          const fileExt = file.originalname.split('.').pop();
          const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
          const params = { Bucket: BUCKET_NAME, Key: `products/${uniqueFilename}`, Body: file.buffer, ContentType: file.mimetype };
          await s3.send(new PutObjectCommand(params));
          product.hoverImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
        }
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
