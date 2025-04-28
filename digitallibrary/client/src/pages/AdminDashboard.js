import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Alert, Spinner, Button, Table, Form, Modal } from 'react-bootstrap';
import { FaBook, FaUsers, FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  
  // Book form state
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    ISBN: '',
    pageCount: '',
    publisher: '',
    publicationYear: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await axios.get('/api/books');
      setBooks(res.data);
      setLoadingBooks(false);
    } catch (err) {
      setError('Error fetching books');
      setLoadingBooks(false);
      console.error('Error fetching books:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get('/api/users');
      setUsers(res.data);
      setLoadingUsers(false);
    } catch (err) {
      setError('Error fetching users');
      setLoadingUsers(false);
      console.error('Error fetching users:', err);
    }
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm({
      ...bookForm,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'pdfFile') {
      setPdfFile(e.target.files[0]);
    } else if (e.target.name === 'coverImage') {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add book details to form data
    Object.keys(bookForm).forEach(key => {
      if (bookForm[key]) formData.append(key, bookForm[key]);
    });

    // Add files to form data
    if (pdfFile) formData.append('pdfFile', pdfFile);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      if (editingBookId) {
        // Update existing book
        await axios.put(`/api/books/${editingBookId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new book
        await axios.post('/api/books', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Reset form and refresh books
      resetBookForm();
      setShowBookModal(false);
      fetchBooks();
    } catch (err) {
      setError('Error saving book');
      console.error('Error saving book:', err);
    }
  };

  const handleEditBook = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      category: book.category || '',
      ISBN: book.ISBN || '',
      pageCount: book.pageCount || '',
      publisher: book.publisher || '',
      publicationYear: book.publicationYear || ''
    });
    setEditingBookId(book.id);
    setShowBookModal(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        fetchBooks();
      } catch (err) {
        setError('Error deleting book');
        console.error('Error deleting book:', err);
      }
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      category: '',
      ISBN: '',
      pageCount: '',
      publisher: '',
      publicationYear: ''
    });
    setPdfFile(null);
    setCoverImage(null);
    setEditingBookId(null);
  };

  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tab.Container id="admin-tabs" defaultActiveKey="books">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="books">
              <FaBook className="me-2" />
              Books
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users">
              <FaUsers className="me-2" />
              Users
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="books">
            <div className="d-flex justify-content-end mb-3">
              <Button 
                variant="success" 
                onClick={() => {
                  resetBookForm();
                  setShowBookModal(true);
                }}
              >
                <FaPlus className="me-2" />
                Add New Book
              </Button>
            </div>
            
            {loadingBooks ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading books...</p>
              </div>
            ) : books.length === 0 ? (
              <Alert variant="info">No books found. Add your first book!</Alert>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category || 'N/A'}</td>
                      <td>{new Date(book.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditBook(book)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab.Pane>
          
          <Tab.Pane eventKey="users">
            {loadingUsers ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <Alert variant="info">No users found.</Alert>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      {/* Book Add/Edit Modal */}
      <Modal show={showBookModal} onHide={() => setShowBookModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingBookId ? 'Edit Book' : 'Add New Book'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={bookForm.title}
                onChange={handleBookInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={bookForm.author}
                onChange={handleBookInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={bookForm.description}
                onChange={handleBookInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={bookForm.category}
                onChange={handleBookInputChange}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="ISBN">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    name="ISBN"
                    value={bookForm.ISBN}
                    onChange={handleBookInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="pageCount">
                  <Form.Label>Page Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="pageCount"
                    value={bookForm.pageCount}
                    onChange={handleBookInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="publisher">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    type="text"
                    name="publisher"
                    value={bookForm.publisher}
                    onChange={handleBookInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="publicationYear">
                  <Form.Label>Publication Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="publicationYear"
                    value={bookForm.publicationYear}
                    onChange={handleBookInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3" controlId="pdfFile">
              <Form.Label>PDF File {!editingBookId && <span className="text-danger">*</span>}</Form.Label>
              <Form.Control
                type="file"
                name="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                required={!editingBookId}
              />
              <Form.Text className="text-muted">
                {editingBookId ? 'Upload a new PDF to replace the existing one (optional)' : 'Upload the book PDF file'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="coverImage">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                Upload a cover image for the book (optional)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBookModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaUpload className="me-2" />
              {editingBookId ? 'Update Book' : 'Add Book'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard; 