const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  ISBN: {
    type: String,
    trim: true
  },
  pageCount: {
    type: Number
  },
  publisher: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number
  }
});

module.exports = mongoose.model('Book', BookSchema); 