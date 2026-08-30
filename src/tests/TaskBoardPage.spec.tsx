const mockUseTasks = jest.fn();
const mockUseMyTasks = jest.fn();
const mockMutate = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
  useMyTasks: () => mockUseMyTasks(),
}));
jest.mock('@/features/task/hooks/useUpdateTaskStatus', () => ({
  useUpdateTaskStatus: () => ({ mutate: mockMutate, isPending: false, variables: undefined }),
}));

import { renderWithProviders, screen } from '@test-utils';
import TaskBoardPage from '@/features/task/screens/TaskBoardPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const tasks = [{ id: 't1', title: 'Card', description: 'd', status: 'Pending', priority: 'High', dueDate: '2026-02-01' }];

const asAdmin = () =>
  useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');

describe('TaskBoardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAdmin();
    mockUseTasks.mockReturnValue({ data: tasks, isLoading: false });
    mockUseMyTasks.mockReturnValue({ data: [], isLoading: false });
  });

  it('shows loading', () => {
    mockUseTasks.mockReturnValue({ data: [], isLoading: true });
    renderWithProviders(<TaskBoardPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseTasks.mockReturnValue({ data: [], isError: true });
    renderWithProviders(<TaskBoardPage />);
    expect(screen.getByText('The task board could not be loaded.')).toBeInTheDocument();
  });

  it('renders the board with stat legend', () => {
    renderWithProviders(<TaskBoardPage />);
    expect(screen.getByText('Task Board')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });
});
