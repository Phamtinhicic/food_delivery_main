import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
  const { restaurant, token } = useContext(StoreContext);

  if (!restaurant || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
