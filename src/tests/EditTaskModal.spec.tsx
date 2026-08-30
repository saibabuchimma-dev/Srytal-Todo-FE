const mockUpdate = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  useUpdateTask: () => ({ mutate: mockUpdate, isPending: false }),
}));
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  useEmployees: () => ({ data: [{ id: 'e1', fullName: 'Emp One' }], isLoading: false }),
}));
jest.mock('@/features/project', () => ({
  useProjects: () => ({ data: [{ id: 'p1', name: 'Proj One' }], isLoading: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import EditTaskModal from '@/features/task/components/EditTaskModal';
import type { Task } from '@/features/task/types/task';

const task: Task = {
  id: 't1',
  title: 'Edit me',
  description: 'Long enough description',
  status: 'Pending',
  priority: 'Low',
  dueDate: '2026-02-01',
  assignedTo: 'e1',
  project: 'p1',
};

describe('EditTaskModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('pre-fills fields and submits an update', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithProviders(<EditTaskModal opened task={task} onClose={onClose} />, { withRouter: false });
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't1' }),
      expect.any(Object),
    );
  });

  it('does nothing when task is null', () => {
    renderWithProviders(<EditTaskModal opened task={null} onClose={jest.fn()} />, { withRouter: false });
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });
});
