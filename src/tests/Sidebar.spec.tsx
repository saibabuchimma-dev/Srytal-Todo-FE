const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({ data: { name: 'Sravani', avatar: '' } }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';

const setUser = (role: 'Admin' | 'Employee') =>
  useAuthStore.getState().login(
    { id: 'u1', fullName: 'Sravani', name: 'Sravani', email: 's@x.com', role, mustChangePassword: false },
    't',
  );

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it('renders the admin menu set', () => {
    setUser('Admin');
    renderWithProviders(<Sidebar />, { route: '/admin/dashboard' });
    ['Dashboard', 'Projects', 'Employees', 'Tasks', 'Board', 'Reports', 'Settings'].forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument(),
    );
  });

  it('renders the employee menu set', () => {
    setUser('Employee');
    renderWithProviders(<Sidebar />, { route: '/dashboard' });
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(screen.queryByText('Employees')).not.toBeInTheDocument();
  });

  it('navigates and calls onNavigate when a menu item is clicked', async () => {
    setUser('Admin');
    const onNavigate = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<Sidebar onNavigate={onNavigate} />, { route: '/admin/dashboard' });
    await user.click(screen.getByText('Projects'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/projects');
    expect(onNavigate).toHaveBeenCalled();
  });

  it('navigates to settings from the profile button', async () => {
    setUser('Employee');
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />, { route: '/dashboard' });
    await user.click(screen.getByText('Sravani'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/settings');
  });
});
