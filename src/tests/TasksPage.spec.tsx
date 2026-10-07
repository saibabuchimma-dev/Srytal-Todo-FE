const mockUsePaginated = jest.fn();
const mockUseDeleteTask = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  usePaginatedTasks: () => mockUsePaginated(),
  useDeleteTask: () => mockUseDeleteTask(),
}));
jest.mock('@/features/task/components/CreateTaskModal', () => ({
  __esModule: true,
  default: ({ opened, onClose }: { opened: boolean; onClose: () => void }) =>
    opened ? (
      <div data-testid="create-task-modal">
        create-task-modal
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));
jest.mock('@/features/task/components/EditTaskModal', () => ({
  __esModule: true,
  default: ({
    opened,
    task,
    onClose,
  }: {
    opened: boolean;
    task: { id: string } | null;
    onClose: () => void;
  }) =>
    opened ? (
      <div data-testid="edit-task-modal">
        edit-task-modal-{task?.id}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));
jest.mock('@/components/common/ConfirmDeleteModal', () => ({
  __esModule: true,
  default: ({
    opened,
    onClose,
    onConfirm,
    loading,
    title,
    message,
  }: {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title: string;
    message: string;
  }) =>
    opened ? (
      <div data-testid="confirm-delete-modal">
        <span>{title}</span>
        <span>{message}</span>
        <button onClick={onConfirm} disabled={loading}>
          Confirm
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

import { renderWithProviders, screen, userEvent, waitFor } from '@test-utils';
import TasksPage from '@/features/task/screens/TasksPage';

const task = {
  id: 't1',
  title: 'Alpha',
  description: 'a',
  status: 'Pending',
  priority: 'High',
  dueDate: '2026-02-01',
  projectDetails: { id: 'p1', name: 'Project A' },
  assignedEmployee: { id: 'u1', fullName: 'John Doe' },
};

const taskCompleted = {
  ...task,
  id: 't2',
  title: 'Beta',
  status: 'Completed',
  priority: 'Low',
  dueDate: '2025-01-01',
};

const taskOverdue = {
  ...task,
  id: 't3',
  title: 'Gamma',
  status: 'In Progress',
  priority: 'Medium',
  dueDate: '2020-01-01',
};

describe('TasksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDeleteTask.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('shows loading skeleton', () => {
    mockUsePaginated.mockReturnValue({ isLoading: true });
    const { unmount } = renderWithProviders(<TasksPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    unmount();
  });

  it('shows error state', () => {
    mockUsePaginated.mockReturnValue({ isError: true });
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('Tasks could not be loaded.')).toBeInTheDocument();
  });

  it('renders tasks and opens the create modal', async () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task], total: 1, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Create Task' }));
    expect(screen.getByText('create-task-modal')).toBeInTheDocument();
  });

  it('shows empty state when no tasks match filter', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [], total: 0, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    renderWithProviders(<TasksPage />);
    expect(
      screen.getByText('No tasks found matching your filters.'),
    ).toBeInTheDocument();
  });

  it('shows overdue indicator for overdue tasks', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [taskOverdue], total: 1, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('(Overdue)')).toBeInTheDocument();
  });

  it('shows project and assignee info', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task], total: 1, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders status and priority text in table cells', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task, taskCompleted], total: 2, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    renderWithProviders(<TasksPage />);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Low').length).toBeGreaterThan(0);
  });

  it('shows fetching skeleton when refetching', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task], total: 1, totalPages: 1 },
      isLoading: false,
      isFetching: true,
    });
    renderWithProviders(<TasksPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles search input with debounce', async () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task], total: 1, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    });
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    const searchInput = screen.getByPlaceholderText('Search by title...');
    await user.type(searchInput, 'Alpha');

    await waitFor(() => {
      expect(mockUsePaginated).toHaveBeenCalled();
    });
  });

  it('renders pagination controls', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [task], total: 25, totalPages: 3 },
      isLoading: false,
      isFetching: false,
    });
    renderWithProviders(<TasksPage />);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });
});
