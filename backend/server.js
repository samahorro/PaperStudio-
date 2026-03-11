const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');

// Initialize Express
const app = express();

// ─── Security Middleware ──────────────────────────
app.use(helmet());               // Security HTTP headers
app.use(cors());                 // Allow cross-origin requests
app.use(express.json());         // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));

// ─── Health Check Route ───────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: '🛍️ PaperStudio API is running!',
        status: 'OK',
        environment: process.env.NODE_ENV
    });
});

// ─── Database Test Route ──────────────────────────
app.get('/api/db-test', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            message: '✅ Database connection successful!',
            database: process.env.DB_NAME,
            host: process.env.DB_HOST
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Database connection failed',
            error: error.message
        });
    }
});

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Connect to database
    await connectDB();

    // Sync database models (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('📦 Database tables synced');

    // Start listening
    app.listen(PORT, () => {
        console.log(`🚀 PaperStudio API running on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
    });
};

startServer();
