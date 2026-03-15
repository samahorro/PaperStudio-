const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define('Coupon', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  discountType: {
    type: DataTypes.ENUM('percent', 'fixed'),
    allowNull: false,
    defaultValue: 'percent'
  },

  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },

  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  currentUses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  timestamps: true
});

module.exports = Coupon;
