const mockUsePaginated = jest.fn();
const mockDelete = jest.fn();
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  usePaginatedEmployees: (...a: unknown[]) => mockUsePaginated(...a),
  useDeleteEmployee: () => ({ mutate: mockDelete, isPending: false }),
  useCreateEmployee: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateEmployee: () => ({ mutate: jest.fn(), isPending: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import { EmployeesPage } from '@/features/employee/screens/EmployeesPage';

const employee = { id: 'e1', fullName: 'Sravani K', email: 's@x.com', role: 'Employee', avatar: '', isActive: true, mustChangePassword: false };

describe('EmployeesPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the loading state', () => {
    mockUsePaginated.mockReturnValue({ isLoading: true });
    renderWithProviders(<EmployeesPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error state', () => {
    mockUsePaginated.mockReturnValue({ isError: true });
    renderWithProviders(<EmployeesPage />);
    expect(screen.getByText('Failed to load employees.')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    mockUsePaginated.mockReturnValue({ data: { items: [], total: 0, totalPages: 1 }, isLoading: false });
    renderWithProviders(<EmployeesPage />);
    expect(screen.getByText('No employees added yet.')).toBeInTheDocument();
  });

  it('renders the employee table and opens the create modal', async () => {
    mockUsePaginated.mockReturnValue({ data: { items: [employee], total: 1, totalPages: 1 }, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);
    expect(screen.getByText('Sravani K')).toBeInTheDocument();
    expect(screen.getByText('1 employee')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /create employee/i }));
    expect(await screen.findByText('Add a new team member to your workspace.')).toBeInTheDocument();
  });
});
