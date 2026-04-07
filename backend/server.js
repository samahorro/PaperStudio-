const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const { connectDB } = require('./config/db');
const { syncDatabase } = require('./models');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const sanitizeMiddleware = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// Security Middleware
// --------------------
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
    contentSecurityPolicy: false,
    hsts: false, // prevents browser from forcing https in dev
  })
);

// CORS — restrict to known origins in production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

// Trust first proxy (nginx / Elastic Beanstalk load balancer)
// This is required for express-rate-limit to work behind a proxy
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : true, // allow all in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook endpoint needs raw body BEFORE json parsing
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// XSS sanitization
app.use(sanitizeMiddleware);

// General rate limiter (all API routes)
app.use('/api', apiLimiter);

// --------------------
// Static Files (React / Vite build)
// --------------------
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, 'public')));

// --------------------
// API Routes
// --------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

// --------------------
// Health Check / DB Test
// --------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// --------------------
// React Catch-All
// --------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --------------------
// Global Error Handler (must be last)
// --------------------
app.use(errorHandler);

// --------------------
// Start Server
// --------------------
const startServer = async () => {
  try {
    // Connect to database
    const connected = await connectDB();
    if (connected) {
      console.log('✅ Database connection established');
      
      // Sync models (alter: true adds new columns without wiping data)
      await syncDatabase({ alter: true });
    } else {
      console.log('⚠️ Starting without database connection');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 PaperStudio API running on port ${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
  }
};

startServer();