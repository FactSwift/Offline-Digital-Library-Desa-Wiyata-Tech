import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaInfoCircle } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const defaultCover = '/assets/placeholder.svg';
  
  return (
    <Card className="h-100 book-card">
      <Card.Img 
        variant="top" 
        src={book.coverImage ? book.coverImage : defaultCover} 
        alt={book.title}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <Card.Text className="text-muted mb-0">by {book.author}</Card.Text>
        <Card.Text className="text-truncate mt-2">
          {book.description ? book.description : 'No description available'}
        </Card.Text>
        <div className="mt-auto pt-3 d-flex justify-content-between">
          <Button 
            as={Link} 
            to={`/books/${book.id}`} 
            variant="outline-primary"
            className="d-flex align-items-center"
          >
            <FaInfoCircle className="me-1" /> Details
          </Button>
          <Button 
            as={Link} 
            to={`/read/${book.id}`} 
            variant="primary"
            className="d-flex align-items-center"
          >
            <FaEye className="me-1" /> Read
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard; 
