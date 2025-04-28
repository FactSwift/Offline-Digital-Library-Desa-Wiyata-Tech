import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 footer">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Digital Library | Local Offline System
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 