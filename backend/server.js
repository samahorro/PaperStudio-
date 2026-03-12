const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  })
);
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Health / DB test
app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      message: '✅ Database connected!',
      host: process.env.DB_HOST,
    });
  } catch (error) {
    res.status(500).json({
      message: '❌ DB failed',
      error: error.message,
    });
  }
});

// React catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server first
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PaperStudio API on port ${PORT}`);
});

// Connect DB after server starts
const startDatabase = async () => {
  try {
    const connected = await connectDB();

    if (connected) {
      console.log('✅ Database connection established');
      // Keep this simple in production
      // await sequelize.sync();
      // console.log('📦 Database tables synced');
    } else {
      console.log('⚠️ Starting without database connection');
    }
  } catch (error) {
    console.error('❌ Database startup failed:', error.message);
  }
};

startDatabase();