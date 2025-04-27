import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { FaSearch } from 'react-icons/fa';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/books');
        setBooks(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data
          .filter(book => book.category)
          .map(book => book.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching books. Please try again later.');
        setLoading(false);
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  // Filter books by search term and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = category === '' || book.category === category;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading books...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-center mb-4">Offline Digital Library</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search books by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {filteredBooks.length === 0 ? (
        <Alert variant="info">No books found matching your criteria.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredBooks.map(book => (
            <Col key={book._id}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home; 