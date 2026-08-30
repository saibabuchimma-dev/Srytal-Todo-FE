const mockUsePaginated = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  usePaginatedTasks: () => mockUsePaginated(),
  useDeleteTask: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock('@/features/task/components/CreateTaskModal', () => ({
  __esModule: true,
  default: ({ opened }: { opened: boolean }) => (opened ? <div>create-task-modal</div> : null),
}));
jest.mock('@/features/task/components/EditTaskModal', () => ({
  __esModule: true,
  default: () => null,
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import TasksPage from '@/features/task/screens/TasksPage';

const task = { id: 't1', title: 'Alpha', description: 'a', status: 'Pending', priority: 'High', dueDate: '2026-02-01' };

describe('TasksPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading and error', () => {
    mockUsePaginated.mockReturnValue({ isLoading: true });
    const { unmount } = renderWithProviders(<TasksPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    unmount();

    mockUsePaginated.mockReturnValue({ isError: true });
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('Tasks could not be loaded.')).toBeInTheDocument();
  });

  it('renders tasks and opens the create modal', async () => {
    mockUsePaginated.mockReturnValue({ data: { items: [task], total: 1, totalPages: 1 }, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Create Task' }));
    expect(screen.getByText('create-task-modal')).toBeInTheDocument();
  });
});
