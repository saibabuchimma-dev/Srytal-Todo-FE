const mockDeleteEmployee = jest.fn();
const mockDeleteProject = jest.fn();
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  usePaginatedEmployees: () => ({ data: { items: [employee], total: 1, totalPages: 1 }, isLoading: false }),
  useDeleteEmployee: () => ({ mutate: mockDeleteEmployee, isPending: false }),
  useCreateEmployee: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateEmployee: () => ({ mutate: jest.fn(), isPending: false }),
}));
const mockUseDetails = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  useProjectDetails: () => mockUseDetails(),
  useEmployeeProjectTasks: () => ({ data: [] }),
  usePaginatedProjects: () => ({ data: { items: [project], total: 1, totalPages: 1 }, isLoading: false }),
  useDeleteProject: () => ({ mutate: mockDeleteProject, isPending: false }),
  useCreateProject: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateProject: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock('@/features/task/hooks/useTasks', () => ({ useDeleteTask: () => ({ mutate: jest.fn(), isPending: false }) }));
jest.mock('@/features/project/components/ProjectModal', () => ({ __esModule: true, default: ({ opened }: { opened: boolean }) => (opened ? <div>project-modal</div> : null) }));
jest.mock('@/features/task/components/CreateTaskModal', () => ({ __esModule: true, default: ({ opened }: { opened: boolean }) => (opened ? <div>task-modal</div> : null) }));

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, userEvent } from '@test-utils';
import { EmployeesPage } from '@/features/employee/screens/EmployeesPage';
import ProjectDetailsPage from '@/features/project/screens/ProjectDetailsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const employee = { id: 'e1', fullName: 'Sravani K', email: 's@x.com', role: 'Employee', avatar: '', isActive: true, mustChangePassword: false, createdAt: '2026-01-01' };
const project = { id: 'p1', name: 'Website Redesign', description: 'desc', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-03-01', members: [] };
const details = {
  project,
  stats: { totalTasks: 2, completed: 1, pending: 1, inProgress: 0 },
  employees: [{ employee: { _id: 'e1', fullName: 'Emma', email: 'e@x.com', role: 'Employee' }, taskCount: 1, tasks: [] }],
  tasks: [{ _id: 't1', title: 'Alpha', description: 'd', status: 'Pending', priority: 'High', dueDate: '2026-02-01', createdAt: '', assignedTo: { _id: 'e1', fullName: 'Emma' } }],
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
});

describe('EmployeesPage delete flow', () => {
  it('opens the confirm modal and deletes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);
    await user.click(screen.getByLabelText('Actions'));
    await user.click(await screen.findByText('Delete'));
    expect(await screen.findByText('Delete Employee')).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[deleteButtons.length - 1]);
    expect(mockDeleteEmployee).toHaveBeenCalledWith('e1', expect.any(Object));
  });
});

describe('ProjectDetailsPage interactions', () => {
  const renderAt = () =>
    renderWithProviders(
      <Routes>
        <Route path="/admin/dashboard/projects/:projectId/details" element={<ProjectDetailsPage />} />
      </Routes>,
      { route: '/admin/dashboard/projects/p1/details' },
    );

  it('renders employees and a task, and opens the task details modal', async () => {
    mockUseDetails.mockReturnValue({ data: details, isLoading: false });
    const user = userEvent.setup();
    renderAt();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    // The first action icon in the task row is "view".
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 3]);
    expect(await screen.findByText('Task Details')).toBeInTheDocument();
  });

  it('opens the edit project modal', async () => {
    mockUseDetails.mockReturnValue({ data: details, isLoading: false });
    const user = userEvent.setup();
    renderAt();
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    expect(await screen.findByText('project-modal')).toBeInTheDocument();
  });
});
