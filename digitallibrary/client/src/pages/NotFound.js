import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <Alert variant="warning">
        <h1 className="display-4">404</h1>
        <h2>Page Not Found</h2>
        <p className="lead">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </Alert>
      <Button as={Link} to="/" variant="primary" size="lg" className="mt-3">
        <FaHome className="me-2" />
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFound; 