const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', bookController.getBooks);

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', bookController.getBook);

// @route   POST api/books
// @desc    Add new book
// @access  Private (Admin only)
router.post(
  '/',
  [
    auth,
    auth.admin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty()
    ]
  ],
  bookController.addBook
);

// @route   PUT api/books/:id
// @desc    Update book
// @access  Private (Admin only)
router.put(
  '/:id',
  [
    auth,
    auth.admin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty()
    ]
  ],
  bookController.updateBook
);

// @route   DELETE api/books/:id
// @desc    Delete book
// @access  Private (Admin only)
router.delete('/:id', [auth, auth.admin], bookController.deleteBook);

module.exports = router; 