require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const { syncDatabase } = require('./models');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect and sync
    await connectDB();
    await syncDatabase({ alter: true });

    // ─── Admin User ────────────────────────────────────
    const adminExists = await User.findOne({ where: { email: 'admin@paperstudio.com' } });
    if (!adminExists) {
      await User.create({
        name: 'PaperStudio Admin',
        email: 'admin@paperstudio.com',
        password: await bcrypt.hash('Admin123!', 12),
        role: 'admin',
        isEmailVerified: true
      });
      console.log('✅ Admin user created (admin@paperstudio.com / Admin123!)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // ─── Products ──────────────────────────────────────
    const productCount = await Product.count();
    if (productCount === 0) {
      const products = [
        // Notebooks
        {
          name: 'Classic Spiral Notebook',
          description: 'A premium 200-page spiral-bound notebook with thick, bleed-resistant paper. Perfect for note-taking and journaling.',
          price: 14.99,
          category: 'notebooks',
          color: 'Black',
          stock: 50,
          imageUrl: null
        },
        {
          name: 'Dotted Grid Journal',
          description: 'Elegant hardcover journal with dot grid pages. Ideal for bullet journaling, planning, and creative layouts.',
          price: 18.99,
          category: 'notebooks',
          color: 'Navy Blue',
          stock: 35,
          imageUrl: null
        },
        {
          name: 'Leather-Bound Notebook',
          description: 'Handcrafted genuine leather notebook with lined pages. A timeless companion for writers and professionals.',
          price: 34.99,
          category: 'notebooks',
          color: 'Brown',
          stock: 20,
          imageUrl: null
        },
        // Sketchbooks
        {
          name: 'Artist Sketchbook A4',
          description: 'Large format sketchbook with heavyweight 180gsm paper. Excellent for pencil, charcoal, and light watercolor work.',
          price: 22.99,
          category: 'sketchbooks',
          color: 'White',
          stock: 30,
          imageUrl: null
        },
        {
          name: 'Pocket Sketchbook',
          description: 'Compact hardcover sketchbook that fits in your pocket. Take your creativity everywhere you go.',
          price: 9.99,
          category: 'sketchbooks',
          color: 'Gray',
          stock: 45,
          imageUrl: null
        },
        // Pens
        {
          name: 'Fine Point Gel Pen (5-Pack)',
          description: "Ultra-smooth 0.5mm gel pens in assorted colors. Quick-drying ink that won't smudge.",
          price: 12.99,
          category: 'pens',
          color: 'Assorted',
          stock: 100,
          imageUrl: null
        },
        {
          name: 'Calligraphy Fountain Pen',
          description: 'Elegant fountain pen with interchangeable nibs. Perfect for calligraphy, lettering, and special writing.',
          price: 29.99,
          category: 'pens',
          color: 'Gold',
          stock: 15,
          imageUrl: null
        },
        // Pencils
        {
          name: 'Drawing Pencil Set (12-Pack)',
          description: 'Professional-grade graphite pencils ranging from 6H to 6B. Essential for sketching and shading.',
          price: 16.99,
          category: 'pencils',
          color: 'Natural Wood',
          stock: 60,
          imageUrl: null
        },
        {
          name: 'Mechanical Pencil 0.7mm',
          description: 'Premium mechanical pencil with ergonomic grip and built-in eraser. Smooth, precise lines every time.',
          price: 8.99,
          category: 'pencils',
          color: 'Silver',
          stock: 80,
          imageUrl: null
        },
        // Cases
        {
          name: 'Canvas Pencil Case',
          description: 'Durable washed canvas roll-up pencil case with 24 individual slots. Protects and organizes your tools.',
          price: 19.99,
          category: 'cases',
          color: 'Olive Green',
          stock: 25,
          imageUrl: null
        },
        {
          name: 'Leather Pen Pouch',
          description: 'Soft genuine leather pen pouch with magnetic closure. Holds up to 10 pens or pencils in style.',
          price: 24.99,
          category: 'cases',
          color: 'Tan',
          stock: 18,
          imageUrl: null
        },
        // Calendars
        {
          name: '2026 Desk Planner',
          description: 'Beautiful illustrated desk calendar with monthly and weekly spreads. Includes goal-tracking and habit pages.',
          price: 26.99,
          category: 'calendars',
          color: 'Pastel Pink',
          stock: 40,
          imageUrl: null
        },
        {
          name: 'Wall Calendar – Botanical',
          description: 'Stunning botanical artwork wall calendar with large date boxes for notes. Printed on premium matte paper.',
          price: 19.99,
          category: 'calendars',
          color: 'Green',
          stock: 30,
          imageUrl: null
        }
      ];

      await Product.bulkCreate(products);
      console.log(`✅ ${products.length} products created`);
    } else {
      console.log(`ℹ️ ${productCount} products already exist`);
    }

    // ─── Coupons ───────────────────────────────────────
    const couponCount = await Coupon.count();
    if (couponCount === 0) {
      await Coupon.bulkCreate([
        {
          code: 'WELCOME10',
          discountType: 'percent',
          discountValue: 10,
          minOrderAmount: 20,
          maxUses: 100,
          currentUses: 0,
          isActive: true,
          expiresAt: new Date('2027-12-31')
        },
        {
          code: 'SAVE5',
          discountType: 'fixed',
          discountValue: 5.00,
          minOrderAmount: 30,
          maxUses: 50,
          currentUses: 0,
          isActive: true,
          expiresAt: new Date('2027-06-30')
        }
      ]);
      console.log('✅ 2 coupons created (WELCOME10 = 10% off, SAVE5 = $5 off)');
    } else {
      console.log(`ℹ️ ${couponCount} coupons already exist`);
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
