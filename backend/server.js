const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./config/db');
const { connectDB } = require('./config/db');

// Initialize Express
const app = express();

// ─── Middleware ────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── API Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.send('<html><body style="background-color: white; color: black; font-family: sans-serif;"><h1>hello world</h1></body></html>');
});

app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: '✅ Database connected!', host: process.env.DB_HOST });
  } catch (error) {
    res.status(500).json({ message: '❌ DB failed', error: error.message });
  }
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
