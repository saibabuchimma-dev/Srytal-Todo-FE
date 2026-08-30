const mockUseMyTasks = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  useMyTasks: () => mockUseMyTasks(),
}));

import { renderWithProviders, screen } from '@test-utils';
import MyTasksPage from '@/features/task/screens/MyTasksPage';

const tasks = [
  { id: 't1', title: 'Alpha', description: 'a', status: 'Completed', priority: 'High', dueDate: '2026-02-01', projectDetails: { id: 'p', name: 'Web' } },
  { id: 't2', title: 'Beta', description: 'b', status: 'Pending', priority: 'Low', dueDate: '2026-02-02' },
];

describe('MyTasksPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the loading state', () => {
    mockUseMyTasks.mockReturnValue({ data: [], isLoading: true });
    renderWithProviders(<MyTasksPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error state', () => {
    mockUseMyTasks.mockReturnValue({ data: [], isError: true });
    renderWithProviders(<MyTasksPage />);
    expect(screen.getByText('Failed to load your tasks.')).toBeInTheDocument();
  });

  it('renders assigned tasks with a summary', () => {
    mockUseMyTasks.mockReturnValue({ data: tasks, isLoading: false });
    renderWithProviders(<MyTasksPage />);
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText(/2 tasks assigned/)).toBeInTheDocument();
  });

  it('renders the empty summary when there are no tasks', () => {
    mockUseMyTasks.mockReturnValue({ data: [], isLoading: false });
    renderWithProviders(<MyTasksPage />);
    expect(screen.getAllByText('No tasks assigned to you yet.').length).toBeGreaterThan(0);
  });
});
