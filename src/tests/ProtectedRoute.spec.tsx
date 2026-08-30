import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '@test-utils';
import ProtectedRoute from '@/app/router/ProtectedRoute';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser } from '@/features/auth/types/auth';

const admin: AuthUser = { id: 'u1', fullName: 'Ad', name: 'Ad', email: 'a@x.com', role: 'Admin', mustChangePassword: false };
const employee: AuthUser = { ...admin, role: 'Employee', mustChangePassword: false };

function tree() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="Admin" />}>
        <Route path="/admin/dashboard" element={<div>Admin Home</div>} />
      </Route>
      <Route path="/admin/login" element={<div>Admin Login</div>} />
      <Route path="/dashboard" element={<div>Employee Home</div>} />
      <Route path="/change-password" element={<div>Change Password</div>} />
    </Routes>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('redirects unauthenticated users to the role login', () => {
    renderWithProviders(tree(), { route: '/admin/dashboard' });
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('redirects a mismatched role to their own dashboard', () => {
    useAuthStore.getState().login(employee, 't');
    renderWithProviders(tree(), { route: '/admin/dashboard' });
    expect(screen.getByText('Employee Home')).toBeInTheDocument();
  });

  it('forces a password change when required', () => {
    useAuthStore.getState().login({ ...admin, mustChangePassword: true }, 't');
    renderWithProviders(tree(), { route: '/admin/dashboard' });
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('renders the outlet for an authorized user', () => {
    useAuthStore.getState().login(admin, 't');
    renderWithProviders(tree(), { route: '/admin/dashboard' });
    expect(screen.getByText('Admin Home')).toBeInTheDocument();
  });
});
