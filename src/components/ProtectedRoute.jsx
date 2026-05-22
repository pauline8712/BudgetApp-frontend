import { Navigate } from 'react-router-dom';

// Skyddar routes — skickar användaren till /login om token saknas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
