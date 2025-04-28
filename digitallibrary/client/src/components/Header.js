import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaBook, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      {user && user.role === 'admin' && (
        <Nav.Link as={Link} to="/admin" className="d-flex align-items-center">
          <FaUserCog className="me-1" /> Admin
        </Nav.Link>
      )}
      <Nav.Item>
        <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
          <FaSignOutAlt className="me-1" /> Logout
        </Button>
      </Nav.Item>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
        <FaSignInAlt className="me-1" /> Login
      </Nav.Link>
      <Nav.Link as={Link} to="/register" className="d-flex align-items-center">
        <FaUserPlus className="me-1" /> Register
      </Nav.Link>
    </>
  );

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaBook className="me-2" /> Digital Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 