const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance connected to PostgreSQL (AWS RDS)
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Database name
    process.env.DB_USER,      // Username
    process.env.DB_PASSWORD,  // Password
    {
        host: process.env.DB_HOST,   // RDS endpoint
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',

        // Connection pool settings
        pool: {
            max: 5,       // Maximum number of connections
            min: 0,       // Minimum number of connections
            acquire: 30000, // Max time (ms) to get a connection before throwing error
            idle: 10000     // Max time (ms) a connection can be idle before being released
        },

        // SSL is required for AWS RDS connections
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // For RDS, we trust their certificate
            }
        },

        // Logging: show SQL queries in development, silent in production
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
);

// Test the database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully (AWS RDS)');
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
