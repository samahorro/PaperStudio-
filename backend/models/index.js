const sequelize = require('../config/db');

// Import all models
const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Coupon = require('./Coupon');
const ContactMessage = require('./ContactMessage');

// ─── Associations ───────────────────────────────────────

// User <-> CartItem (1:M)
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// Product <-> CartItem (1:M)
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// User <-> Order (1:M)
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order <-> OrderItem (1:M)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product <-> OrderItem (1:M)
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// ─── Sync Helper ────────────────────────────────────────

const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synced with database');
    return true;
  } catch (error) {
    console.error('❌ Model sync failed:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
  Coupon,
  ContactMessage,
  syncDatabase
};
