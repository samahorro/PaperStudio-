const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('notebooks', 'sketchbooks', 'calendars', 'pens', 'pencils', 'cases'),
    allowNull: false,
    defaultValue: 'notebooks'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hoverImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  colorsCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  collectionName: {
    type: DataTypes.ENUM('None', 'Wooden Collection', 'Zento Collection', 'Kuru Toga Collection'),
    defaultValue: 'None'
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: (product) => {
      product.inStock = product.stock > 0;
    }
  }
});

module.exports = Product;
