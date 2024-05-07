// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from  '../hooks/useAuth'; // Adjust the import path as necessary
import { useIntl } from 'react-intl';

interface ProtectedRouteProps {
  element: React.ReactElement;
  titleId: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, titleId }) => {
  const isAuthenticated = useAuth();
  
  const { formatMessage } = useIntl();
  if (titleId) {
    document.title = formatMessage({
      id: titleId,
    });
  }
  // debugger
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // Render the protected component for authenticated users
  return element;
};

export default ProtectedRoute;