const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ISBN: {
    type: DataTypes.STRING
  },
  pageCount: {
    type: DataTypes.INTEGER
  },
  publisher: {
    type: DataTypes.STRING
  },
  publicationYear: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true,
  createdAt: 'uploadDate',
  updatedAt: 'updatedAt'
});

// Removed duplicate association - this is defined in index.js

module.exports = Book; 