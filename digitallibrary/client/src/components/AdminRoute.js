import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 