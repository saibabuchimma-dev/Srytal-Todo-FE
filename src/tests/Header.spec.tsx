const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('@/features/notification/components/NotificationMenu', () => ({
  __esModule: true,
  default: () => <div data-testid="notif-menu" />,
}));
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({ data: { name: 'Sravani', avatar: '' } }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import Header from '@/layouts/MainLayout/Header';
import { useAuthStore } from '@/features/auth/store/auth.store';

const setUser = (role: 'Admin' | 'Employee') =>
  useAuthStore.getState().login(
    { id: 'u1', fullName: 'Sravani', name: 'Sravani', email: 's@x.com', role, mustChangePassword: false },
    't',
  );

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it('renders brand, notification menu and theme toggle', () => {
    setUser('Admin');
    renderWithProviders(<Header />, { route: '/admin/dashboard' });
    expect(screen.getByText('Srytal')).toBeInTheDocument();
    expect(screen.getByTestId('notif-menu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
  });

  it('derives the page title from the route', () => {
    setUser('Admin');
    renderWithProviders(<Header />, { route: '/admin/dashboard/employees' });
    expect(screen.getByText('Employees')).toBeInTheDocument();
  });

  it('shows the burger and calls onNavToggle', async () => {
    setUser('Employee');
    const onNavToggle = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<Header navOpened={false} onNavToggle={onNavToggle} />, { route: '/dashboard' });
    await user.click(screen.getByLabelText('Toggle navigation'));
    expect(onNavToggle).toHaveBeenCalled();
  });

  it('logs out from the account menu', async () => {
    setUser('Employee');
    const user = userEvent.setup();
    renderWithProviders(<Header />, { route: '/dashboard' });
    await user.click(screen.getByLabelText('Account menu'));
    await user.click(await screen.findByText('Logout'));
    expect(useAuthStore.getState().user).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
