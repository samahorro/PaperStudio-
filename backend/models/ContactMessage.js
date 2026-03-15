const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactMessage = sequelize.define('ContactMessage', {

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
    validate: {
      isEmail: true
    }
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General Inquiry'
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('new', 'read', 'replied'),
    defaultValue: 'new'
  }

}, {
  timestamps: true
});

module.exports = ContactMessage;
