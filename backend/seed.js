require('dotenv').config();
const { connectDB } = require('./config/db');
const { syncDatabase } = require('./models');
const Product = require('./models/Product');

async function seed() {
  await connectDB();
  await syncDatabase({ alter: true });

  const newProduct = await Product.create({
    name: '[Limited] Ballpoint Knock Pen Body / Muji',
    description: 'A smooth writing pen body.',
    price: 15.00,
    category: 'pens',
    color: 'black',
    stock: 50,
    imageUrl: '/images/Ballpoint Knock Pen Body.webp',
    hoverImageUrl: '/images/Ballpoint Knock Pen Body(hover image)webp.webp',
    isNewArrival: true,
    colorsCount: 3
  });

  console.log('Seed successful:', newProduct.toJSON());
  process.exit();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
