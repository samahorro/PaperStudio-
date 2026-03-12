const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Product = require('../models/Product');
const crypto = require('crypto');

// Configure S3 Client
// IMPORTANT: The region and bucket need to match what the user creates in AWS.
// If the environment variables aren't set yet, it will fail gracefully when trying to upload.
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    // If running inside Elastic Beanstalk with an IAM role, AWS will auto-provide these.
    // For local testing, the user must add them to their .env file.
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadProductAndImage = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let imageUrl = null;

    // Check if the Admin uploaded a file via Multer
    if (req.file) {
      const BUCKET_NAME = process.env.S3_BUCKET_NAME;
      if (!BUCKET_NAME) {
        return res.status(500).json({ message: "S3_BUCKET_NAME environment variable is missing!" });
      }

      // Generate a unique, safe filename for S3
      const fileExt = req.file.originalname.split('.').pop();
      const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;

      // Prepare the upload parameters
      const params = {
        Bucket: BUCKET_NAME,
        Key: `products/${uniqueFilename}`,
        Body: req.file.buffer, // Buffer comes directly from Multer's memory storage
        ContentType: req.file.mimetype,
      };

      // Upload file to S3
      await s3.send(new PutObjectCommand(params));

      // Construct the public S3 URL (assuming the bucket allows public read access)
      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/products/${uniqueFilename}`;
    }

    // Save the product details to the database, including the generated Image URL
    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
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

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

module.exports = {
  uploadProductAndImage,
  getAllProducts
};
