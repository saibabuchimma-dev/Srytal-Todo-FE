const mockUseEmployees = jest.fn();
const mockUseTasks = jest.fn();
const mockUseMyTasks = jest.fn();
jest.mock('@/features/employee/hooks/useEmployees', () => ({ useEmployees: (...a: unknown[]) => mockUseEmployees(...a) }));
jest.mock('@/features/task/hooks/useTasks', () => ({
  useTasks: (...a: unknown[]) => mockUseTasks(...a),
  useMyTasks: (...a: unknown[]) => mockUseMyTasks(...a),
}));

import { renderWithProviders, screen } from '@test-utils';
import StatsCard from '@/features/dashboard/components/StatsCard';
import DashboardStats from '@/features/dashboard/components/DashboardStats';
import { useAuthStore } from '@/features/auth/store/auth.store';

const tasks = [
  { id: 't1', status: 'Completed' },
  { id: 't2', status: 'Pending' },
  { id: 't3', status: 'In Progress' },
];

describe('StatsCard', () => {
  it('renders label, value and hint', () => {
    renderWithProviders(<StatsCard label="Total" value={42} icon={<span />} hint="all good" />, { withRouter: false });
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('all good')).toBeInTheDocument();
  });
});

describe('DashboardStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEmployees.mockReturnValue({ data: [{ id: 'e1', isActive: true }, { id: 'e2', isActive: false }], isLoading: false });
    mockUseTasks.mockReturnValue({ data: tasks, isLoading: false });
    mockUseMyTasks.mockReturnValue({ data: tasks, isLoading: false });
  });

  const asAdmin = () =>
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
  const asEmployee = () =>
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Employee', mustChangePassword: false }, 't');

  it('renders admin cards', () => {
    asAdmin();
    renderWithProviders(<DashboardStats />, { withRouter: false });
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('1 inactive')).toBeInTheDocument();
  });

  it('renders employee cards', () => {
    asEmployee();
    renderWithProviders(<DashboardStats />, { withRouter: false });
    expect(screen.getByText('Assigned Tasks')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders the loading skeleton', () => {
    asAdmin();
    mockUseTasks.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = renderWithProviders(<DashboardStats />, { withRouter: false });
    expect(container.querySelectorAll('.mantine-Skeleton-root').length).toBeGreaterThan(0);
  });
});
