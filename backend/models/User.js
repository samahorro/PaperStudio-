const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true
  },

  city: {
    type: DataTypes.STRING,
    allowNull: true
  },

  state: {
    type: DataTypes.STRING,
    allowNull: true
  },

  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  role: {
    type: DataTypes.ENUM('customer', 'admin'),
    defaultValue: 'customer'
  },

  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  emailVerificationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  mfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  mfaSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },

  passwordResetCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  timestamps: true
});

module.exports = User;