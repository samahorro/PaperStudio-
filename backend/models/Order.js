const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },

  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  shipping: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  couponCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },

  paymentMethod: {
    type: DataTypes.ENUM('card', 'paypal', 'apple_wallet'),
    defaultValue: 'card'
  },

  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  isGift: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  scheduledDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  timestamps: true
});

module.exports = Order;
