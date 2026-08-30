const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  useCreateEmployee: () => ({ mutate: mockCreate, isPending: false }),
  useUpdateEmployee: () => ({ mutate: mockUpdate, isPending: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import CreateEmployeeModal from '@/features/employee/components/CreateEmployeeModal';
import EditEmployeeModal from '@/features/employee/components/EditEmployeeModal';
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

describe('CreateEmployeeModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders and creates an employee', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateEmployeeModal opened onClose={jest.fn()} />, { withRouter: false });
    expect(screen.getByText('Create Employee')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Full Name'), 'New Person');
    await user.type(screen.getByLabelText('Email'), 'new@x.com');
    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(mockCreate).toHaveBeenCalled();
  });
});

describe('EditEmployeeModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('pre-fills and updates an employee', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditEmployeeModal opened employee={employee} onClose={jest.fn()} />, { withRouter: false });
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sravani K')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('handles a null employee without crashing', () => {
    renderWithProviders(<EditEmployeeModal opened employee={null} onClose={jest.fn()} />, { withRouter: false });
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
  });
});
