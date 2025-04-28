import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [registerError, setRegisterError] = useState('');

  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }

    // Set error from auth context
    if (error) {
      setRegisterError(error);
      clearError();
    }
  }, [isAuthenticated, navigate, error, clearError]);

  const { username, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Check password match when either password field changes
    if (e.target.name === 'password' || e.target.name === 'password2') {
      if (e.target.name === 'password') {
        setPasswordMatch(e.target.value === password2);
      } else {
        setPasswordMatch(password === e.target.value);
      }
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || !passwordMatch) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (password !== password2) {
      setPasswordMatch(false);
      return;
    }

    setRegisterError('');
    const success = await register({ username, email, password });
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="register-container">
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <FaUserPlus className="me-2" />
            Register for Digital Library
          </Card.Title>
          
          {registerError && (
            <Alert variant="danger">{registerError}</Alert>
          )}

          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                name="username"
                value={username}
                onChange={onChange}
                required
                minLength="3"
              />
              <Form.Control.Feedback type="invalid">
                Username must be at least 3 characters.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                name="password2"
                value={password2}
                onChange={onChange}
                required
                isInvalid={validated && !passwordMatch}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
            >
              Register
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Already have an account? <Link to="/login">Login here</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Register; 