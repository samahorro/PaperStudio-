const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const { connectDB } = require('./config/db');

// Initialize Express
const app = express();

// ─── Middleware ────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── Serve Frontend ────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: '✅ Database connected!', host: process.env.DB_HOST });
  } catch (error) {
    res.status(500).json({ message: '❌ DB failed', error: error.message });
  }
});

// ─── Catch-All Route ──────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('📦 Database tables synced');
  app.listen(PORT, () => console.log(`🚀 PaperStudio API on port ${PORT}`));
};

startServer();
