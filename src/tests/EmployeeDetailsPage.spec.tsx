const mockUseEmployee = jest.fn();
const mockUseTasks = jest.fn();
jest.mock('@/features/employee/hooks/useEmployees', () => ({ useEmployee: () => mockUseEmployee() }));
jest.mock('@/features/task/hooks/useTasks', () => ({ useTasks: () => mockUseTasks() }));

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '@test-utils';
import EmployeeDetailsPage from '@/features/employee/screens/EmployeeDetailsPage';

const employee = { id: 'e1', fullName: 'Sravani K', email: 's@x.com', role: 'Employee', avatar: '', isActive: true, mustChangePassword: false };
const tasks = [{ id: 't1', title: 'Task A', description: 'd', status: 'Completed', priority: 'High', dueDate: '2026-02-01', assignedTo: 'e1' }];

const renderAt = () =>
  renderWithProviders(
    <Routes>
      <Route path="/admin/dashboard/employees/:employeeId" element={<EmployeeDetailsPage />} />
    </Routes>,
    { route: '/admin/dashboard/employees/e1' },
  );

describe('EmployeeDetailsPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading', () => {
    mockUseEmployee.mockReturnValue({ data: undefined, isLoading: true });
    mockUseTasks.mockReturnValue({ data: [], isLoading: false });
    renderAt();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseEmployee.mockReturnValue({ data: undefined, isError: true });
    mockUseTasks.mockReturnValue({ data: [], isLoading: false });
    renderAt();
    expect(screen.getByText('Employee details could not be loaded.')).toBeInTheDocument();
  });

  it('renders the employee, per-employee stats and their tasks', () => {
    mockUseEmployee.mockReturnValue({ data: employee, isLoading: false });
    mockUseTasks.mockReturnValue({ data: tasks, isLoading: false });
    renderAt();
    expect(screen.getByText('Employee Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText(/1 task assigned to Sravani K/)).toBeInTheDocument();
  });
});
