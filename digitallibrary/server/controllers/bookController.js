const { Book, User } = require('../models');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['uploadDate', 'DESC']],
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'username']
      }]
    });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get book by ID
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'username']
      }]
    });
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add new book
exports.addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No files were uploaded' });
    }

    const { pdfFile, coverImage } = req.files;
    const { title, author, description, category, ISBN, pageCount, publisher, publicationYear } = req.body;

    // Validate PDF file
    if (!pdfFile) {
      return res.status(400).json({ msg: 'PDF file is required' });
    }

    if (!pdfFile.mimetype.includes('pdf')) {
      return res.status(400).json({ msg: 'File must be a PDF' });
    }

    // Create unique filenames
    const pdfFileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '_')}`;
    const pdfPath = path.join(__dirname, '../uploads', pdfFileName);
    
    // Create new book data
    const newBookData = {
      title,
      author,
      description,
      category,
      filePath: `/uploads/${pdfFileName}`,
      uploadedBy: req.user.id,
      ISBN,
      pageCount: pageCount ? parseInt(pageCount) : null,
      publisher,
      publicationYear: publicationYear ? parseInt(publicationYear) : null
    };

    // Handle cover image if provided
    if (coverImage) {
      if (!coverImage.mimetype.includes('image')) {
        return res.status(400).json({ msg: 'Cover file must be an image' });
      }

      const coverFileName = `cover-${Date.now()}-${coverImage.name.replace(/\s+/g, '_')}`;
      const coverPath = path.join(__dirname, '../uploads', coverFileName);
      
      // Save cover image
      coverImage.mv(coverPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading cover image');
        }
      });

      newBookData.coverImage = `/uploads/${coverFileName}`;
    }

    // Save PDF file
    pdfFile.mv(pdfPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading PDF file');
      }

      // Save book to database
      const book = await Book.create(newBookData);
      res.json(book);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update book
exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, description, category, ISBN, pageCount, publisher, publicationYear } = req.body;

  // Build book update object
  const bookFields = {};
  if (title) bookFields.title = title;
  if (author) bookFields.author = author;
  if (description) bookFields.description = description;
  if (category) bookFields.category = category;
  if (ISBN) bookFields.ISBN = ISBN;
  if (pageCount) bookFields.pageCount = parseInt(pageCount);
  if (publisher) bookFields.publisher = publisher;
  if (publicationYear) bookFields.publicationYear = parseInt(publicationYear);

  try {
    let book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Handle files if provided
    if (req.files) {
      const { pdfFile, coverImage } = req.files;

      // Handle new PDF file
      if (pdfFile) {
        if (!pdfFile.mimetype.includes('pdf')) {
          return res.status(400).json({ msg: 'File must be a PDF' });
        }

        // Remove old PDF file
        if (book.filePath) {
          const oldFilePath = path.join(__dirname, '..', book.filePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Save new PDF file
        const pdfFileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '_')}`;
        const pdfPath = path.join(__dirname, '../uploads', pdfFileName);
        
        pdfFile.mv(pdfPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error uploading PDF file');
          }
        });

        bookFields.filePath = `/uploads/${pdfFileName}`;
      }

      // Handle new cover image
      if (coverImage) {
        if (!coverImage.mimetype.includes('image')) {
          return res.status(400).json({ msg: 'Cover file must be an image' });
        }

        // Remove old cover image
        if (book.coverImage) {
          const oldCoverPath = path.join(__dirname, '..', book.coverImage);
          if (fs.existsSync(oldCoverPath)) {
            fs.unlinkSync(oldCoverPath);
          }
        }

        // Save new cover image
        const coverFileName = `cover-${Date.now()}-${coverImage.name.replace(/\s+/g, '_')}`;
        const coverPath = path.join(__dirname, '../uploads', coverFileName);
        
        coverImage.mv(coverPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error uploading cover image');
          }
        });

        bookFields.coverImage = `/uploads/${coverFileName}`;
      }
    }

    // Update book
    await book.update(bookFields);
    
    // Get the updated book
    const updatedBook = await Book.findByPk(req.params.id);
    res.json(updatedBook);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove PDF file
    if (book.filePath) {
      const filePath = path.join(__dirname, '..', book.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove cover image
    if (book.coverImage) {
      const coverPath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // Remove book from database
    await book.destroy();

    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 