const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import EmployeeCard from '@/features/employee/components/EmployeeCard';
import { useEmployeeStore } from '@/features/employee/store/employee.store';
import type { Employee } from '@/features/employee/types/employee';

const employee: Employee = {
  id: 'e1',
  fullName: 'Sravani K',
  email: 's@x.com',
  role: 'Employee',
  avatar: '',
  isActive: true,
  mustChangePassword: false,
};

describe('EmployeeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useEmployeeStore.setState({ selectedEmployee: null });
  });

  it('renders the employee and navigates to details on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeCard employee={employee} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Sravani K')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    await user.click(screen.getByText('Sravani K'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/employees/e1');
    expect(useEmployeeStore.getState().selectedEmployee?.id).toBe('e1');
  });

  it('renders inactive state and fires edit/delete', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderWithProviders(
      <EmployeeCard employee={{ ...employee, isActive: false }} onEdit={onEdit} onDelete={onDelete} />,
    );
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }));
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });

  it('highlights when it is the selected employee', () => {
    useEmployeeStore.setState({ selectedEmployee: employee });
    renderWithProviders(<EmployeeCard employee={employee} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Sravani K')).toBeInTheDocument();
  });
});
