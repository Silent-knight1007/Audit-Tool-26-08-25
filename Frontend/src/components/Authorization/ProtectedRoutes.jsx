import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="text-center mt-20 text-xl font-bold text-red-600">
        🚫 You are not authorized to see this page.
      </div>
    );
  }

  return children;
}
