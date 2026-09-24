import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/config/routes';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const target =
    user?.role === 'Admin' ? ROUTES.ADMIN_SETTINGS : ROUTES.SETTINGS;

  return <Navigate to={target} replace />;
}
