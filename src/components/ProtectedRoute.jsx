import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Guards /admin/* routes — redirects to login if not authenticated.
// Safe to read currentUser synchronously: AuthProvider only renders its
// children after Firebase's initial auth state has resolved.
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin/login" replace />;
}
