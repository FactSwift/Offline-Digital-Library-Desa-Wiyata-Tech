import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaEye } from 'react-icons/fa';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching book details. Please try again later.');
        setLoading(false);
        console.error('Error fetching book:', err);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading book details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Library
          </Button>
        </div>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Book not found.</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Library
          </Button>
        </div>
      </Container>
    );
  }

  const defaultCover = 'https://via.placeholder.com/300x400?text=No+Cover';

  return (
    <Container>
      <Button as={Link} to="/" variant="outline-primary" className="mb-4">
        <FaArrowLeft className="me-2" />
        Back to Library
      </Button>
      
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <img 
                src={book.coverImage ? `http://localhost:5000${book.coverImage}` : defaultCover} 
                alt={book.title} 
                className="book-cover img-fluid rounded shadow"
              />
              <div className="mt-4">
                <Button 
                  as={Link} 
                  to={`/read/${book._id}`} 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                >
                  <FaEye className="me-2" />
                  Read Book
                </Button>
              </div>
            </Col>
            <Col md={8}>
              <h1 className="mb-3">{book.title}</h1>
              <h5 className="text-muted mb-4">by {book.author}</h5>
              
              {book.description && (
                <div className="mb-4">
                  <h5>Description</h5>
                  <p>{book.description}</p>
                </div>
              )}
              
              <Row className="mb-4">
                <Col xs={12} md={6}>
                  <h5>Details</h5>
                  <dl className="row">
                    {book.category && (
                      <>
                        <dt className="col-sm-4">Category</dt>
                        <dd className="col-sm-8">{book.category}</dd>
                      </>
                    )}
                    {book.publisher && (
                      <>
                        <dt className="col-sm-4">Publisher</dt>
                        <dd className="col-sm-8">{book.publisher}</dd>
                      </>
                    )}
                    {book.publicationYear && (
                      <>
                        <dt className="col-sm-4">Year</dt>
                        <dd className="col-sm-8">{book.publicationYear}</dd>
                      </>
                    )}
                    {book.ISBN && (
                      <>
                        <dt className="col-sm-4">ISBN</dt>
                        <dd className="col-sm-8">{book.ISBN}</dd>
                      </>
                    )}
                    {book.pageCount && (
                      <>
                        <dt className="col-sm-4">Pages</dt>
                        <dd className="col-sm-8">{book.pageCount}</dd>
                      </>
                    )}
                  </dl>
                </Col>
                <Col xs={12} md={6}>
                  <h5>File Information</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Added</dt>
                    <dd className="col-sm-8">
                      {new Date(book.uploadDate).toLocaleDateString()}
                    </dd>
                  </dl>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookDetails; 