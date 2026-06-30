import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
