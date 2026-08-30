const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockUseTasks = jest.fn();
const mockUseMyTasks = jest.fn();
const mockUseEmployees = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
  useMyTasks: () => mockUseMyTasks(),
}));
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  useEmployees: () => mockUseEmployees(),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import { useAuthStore } from '@/features/auth/store/auth.store';

const tasks = [
  { id: 't1', title: 'Due soon', description: 'x', status: 'Pending', priority: 'High', dueDate: '2026-05-01' },
  { id: 't2', title: 'Done', description: 'y', status: 'Completed', priority: 'Low', dueDate: '2026-04-01' },
];

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.mockReturnValue({ data: tasks, isLoading: false });
    mockUseMyTasks.mockReturnValue({ data: tasks, isLoading: false });
    mockUseEmployees.mockReturnValue({ data: [], isLoading: false });
  });

  const asAdmin = () =>
    useAuthStore.getState().login({ id: 'u', fullName: 'Sara', name: 'Sara', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
  const asEmployee = () =>
    useAuthStore.getState().login({ id: 'u', fullName: 'Sara', name: 'Sara', email: 'a@x.com', role: 'Employee', mustChangePassword: false }, 't');

  it('shows loading', () => {
    asAdmin();
    mockUseTasks.mockReturnValue({ data: undefined, isLoading: true });
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the admin dashboard with overview and upcoming work', () => {
    asAdmin();
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText('Welcome back, Sara')).toBeInTheDocument();
    expect(screen.getByText('Task Overview')).toBeInTheDocument();
    expect(screen.getByText('Due soon')).toBeInTheDocument();
  });

  it('navigates from an admin quick action', async () => {
    asAdmin();
    const user = userEvent.setup();
    renderWithProviders(<DashboardScreen />);
    await user.click(screen.getByRole('button', { name: /employees/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/employees');
  });

  it('renders the employee variant and empty upcoming state', () => {
    asEmployee();
    mockUseMyTasks.mockReturnValue({ data: [{ id: 't3', title: 'C', description: 'z', status: 'Completed', priority: 'Low', dueDate: '2026-04-01' }], isLoading: false });
    renderWithProviders(<DashboardScreen />);
    expect(screen.getByText(/Here is what needs your attention/)).toBeInTheDocument();
    expect(screen.getByText(/all caught up/)).toBeInTheDocument();
  });
});
