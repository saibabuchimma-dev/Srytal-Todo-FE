const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('@/features/auth/services/auth.service', () => ({ login: jest.fn() }));
jest.mock('@/shared/utils/toast', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import LoginForm from '@/features/auth/components/LoginForm';
import { login } from '@/features/auth/services/auth.service';
import { toast } from '@/shared/utils/toast';
import { useAuthStore } from '@/features/auth/store/auth.store';

const mockLogin = login as jest.Mock;
const mToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Email address'), 'a@x.com');
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it('logs an employee in and routes to the dashboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: 'Employee', token: 't', mustChangePassword: false });
    renderWithProviders(<LoginForm portal="employee" />);
    await fill(user);
    expect(mToast.success).toHaveBeenCalledWith('Success', 'Login successful');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('routes an admin to the admin dashboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: 'Admin', token: 't', mustChangePassword: false });
    renderWithProviders(<LoginForm portal="admin" />);
    await fill(user);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
  });

  it('rejects login from the wrong portal', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: 'Admin', token: 't', mustChangePassword: false });
    renderWithProviders(<LoginForm portal="employee" />);
    await fill(user);
    expect(mToast.error).toHaveBeenCalledWith('Wrong Portal', expect.any(String));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects to change-password when required', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: 'Employee', token: 't', mustChangePassword: true });
    renderWithProviders(<LoginForm portal="employee" />);
    await fill(user);
    expect(mockNavigate).toHaveBeenCalledWith('/change-password', { replace: true });
  });

  it('shows an error toast when login throws', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce(new Error('Server down'));
    renderWithProviders(<LoginForm portal="employee" />);
    await fill(user);
    expect(mToast.error).toHaveBeenCalledWith('Login Failed', 'Server down');
  });
});
