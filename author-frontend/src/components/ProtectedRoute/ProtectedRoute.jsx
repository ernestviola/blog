import { isLoggedIn } from '@utils/auth.js';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  if (!isLoggedIn()) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
