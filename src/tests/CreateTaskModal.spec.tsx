const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  useCreateTask: () => ({ mutate: mockCreate, isPending: false }),
  useUpdateTask: () => ({ mutate: mockUpdate, isPending: false }),
}));
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  useEmployees: () => ({ data: [{ id: 'e1', fullName: 'Emp One' }], isLoading: false }),
}));
jest.mock('@/features/project', () => ({
  useProjects: () => ({ data: [{ id: 'p1', name: 'Proj One' }], isLoading: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import CreateTaskModal from '@/features/task/components/CreateTaskModal';
import type { Task } from '@/features/task/types/task';

const task: Task = {
  id: 't1',
  title: 'Existing',
  description: 'Existing description',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2026-02-01',
  assignedTo: 'e1',
  project: 'p1',
};

describe('CreateTaskModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders in create mode', () => {
    renderWithProviders(<CreateTaskModal opened onClose={jest.fn()} projectId="p1" />, { withRouter: false });
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('creates a task when the required fields are valid', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    renderWithProviders(
      <CreateTaskModal opened onClose={jest.fn()} projectId="p1" onSuccess={onSuccess} />,
      { withRouter: false },
    );
    await user.type(screen.getByLabelText('Task Title'), 'Brand new task');
    await user.type(screen.getByLabelText('Description'), 'A sufficiently long description');
    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(mockCreate).toHaveBeenCalled();
  });

  it('updates an existing task in edit mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateTaskModal opened onClose={jest.fn()} mode="edit" task={task} />,
      { withRouter: false },
    );
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect(mockUpdate).toHaveBeenCalled();
  });
});
