const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const { connectDB } = require('./config/db');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: '✅ Database connected!', host: process.env.DB_HOST });
  } catch (error) {
    res.status(500).json({ message: '❌ DB failed', error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Start server first
app.listen(PORT, () => {
  console.log(`🚀 PaperStudio API on port ${PORT}`);
});

// Connect DB in background
const startDatabase = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('📦 Database tables synced');
  } catch (error) {
    console.error('❌ Database startup failed:', error.message);
  }
};

startDatabase();