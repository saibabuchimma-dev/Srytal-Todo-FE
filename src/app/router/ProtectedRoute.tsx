import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import type { UserRole } from '@/features/auth/types/auth';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  redirectPath?: string;
}

export default function ProtectedRoute({ requiredRole, redirectPath }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);

  if (!user) {
    return (
      <Navigate
        to={redirectPath ?? (requiredRole === 'Admin' ? '/admin/login' : '/login')}
        replace
        state={{ from: location }}
      />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  if (
    requiredRole === 'Employee' &&
    mustChangePassword &&
    location.pathname !== '/change-password'
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
}
