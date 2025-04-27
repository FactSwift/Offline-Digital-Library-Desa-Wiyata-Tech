import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }

    // Set error from auth context
    if (error) {
      setLoginError(error);
      clearError();
    }
  }, [isAuthenticated, navigate, error, clearError]);

  const { username, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoginError('');
    const success = await login({ username, password });
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <FaSignInAlt className="me-2" />
            Login to Digital Library
          </Card.Title>
          
          {loginError && (
            <Alert variant="danger">{loginError}</Alert>
          )}

          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
            >
              Login
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Don't have an account? <Link to="/register">Register here</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Login; 