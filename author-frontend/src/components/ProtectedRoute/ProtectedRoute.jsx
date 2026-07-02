import { useAuth } from '@contexts/AuthContext.jsx';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
