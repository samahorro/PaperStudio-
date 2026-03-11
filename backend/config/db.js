const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance connected to PostgreSQL (AWS RDS)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
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

// Export sequelize as default AND as named export
// This way Sam's code (require('../config/db')) AND our code (require('./config/db').sequelize) both work
module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;
