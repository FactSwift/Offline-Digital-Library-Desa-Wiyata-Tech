const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');

// Define all model relationships
User.hasMany(Book, { foreignKey: 'uploadedBy', as: 'books' });
Book.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// Sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Book,
  syncDatabase
}; 