const mockUseTask = jest.fn();
const mockUseUpdateTaskStatus = jest.fn();
const mockUseDeleteTask = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/features/task/hooks/useTasks', () => ({
  useTask: () => mockUseTask(),
  useDeleteTask: () => mockUseDeleteTask(),
}));
jest.mock('@/features/task/hooks/useUpdateTaskStatus', () => ({
  useUpdateTaskStatus: () => mockUseUpdateTaskStatus(),
}));
jest.mock('@/features/activity/components/ActivityTimeline', () => ({
  __esModule: true,
  default: () => <div data-testid="activity-timeline">activity</div>,
}));
jest.mock('@/features/comment/components/CommentSection', () => ({
  __esModule: true,
  default: () => <div data-testid="comment-section">comments</div>,
}));
jest.mock('@/features/attachment/components/AttachmentSection', () => ({
  __esModule: true,
  default: () => <div data-testid="attachment-section">attachments</div>,
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

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, userEvent, waitFor } from '@test-utils';
import TaskDetailsPage from '@/features/task/screens/TaskDetailsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const task = {
  id: 't1',
  title: 'Design homepage',
  description: 'Build hero',
  status: 'Pending',
  priority: 'High',
  dueDate: '2026-02-01',
  projectDetails: { id: 'p1', name: 'Website' },
  assignedEmployee: { id: 'u1', fullName: 'John Doe' },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-02T00:00:00Z',
};

const taskCompleted = {
  ...task,
  id: 't2',
  title: 'Completed task',
  status: 'Completed',
  priority: 'Low',
};

const renderAt = () =>
  renderWithProviders(
    <Routes>
      <Route
        path="/admin/dashboard/tasks/:taskId"
        element={<TaskDetailsPage />}
      />
    </Routes>,
    { route: '/admin/dashboard/tasks/t1' },
  );

describe('TaskDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockUseUpdateTaskStatus.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    mockUseDeleteTask.mockReturnValue({ mutate: jest.fn(), isPending: false });
    // Set up admin user by default
    useAuthStore.getState().login(
      {
        id: 'u1',
        fullName: 'Admin User',
        name: 'Admin',
        email: 'admin@test.com',
        role: 'Admin',
        mustChangePassword: false,
      },
      'token',
    );
  });

  it('shows loading', () => {
    mockUseTask.mockReturnValue({ data: undefined, isLoading: true });
    renderAt();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseTask.mockReturnValue({ data: undefined, isError: true });
    renderAt();
    expect(screen.getByText('Task could not be loaded.')).toBeInTheDocument();
  });

  it('redirects when task is not found', () => {
    mockUseTask.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderAt();
    expect(screen.getByText('Task could not be loaded.')).toBeInTheDocument();
  });

  it('shows project name', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getAllByText('Website').length).toBeGreaterThan(0);
  });

  it('shows priority badge', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows created and updated dates', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('renders status segmented control', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getByText('Stage & Status')).toBeInTheDocument();
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows completed message when task is completed', () => {
    mockUseTask.mockReturnValue({ data: taskCompleted, isLoading: false });
    renderAt();
    expect(screen.getByText('This task is completed.')).toBeInTheDocument();
  });

  it('opens edit modal when Edit button clicked (admin)', async () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByText('Edit'));
    expect(screen.getByText('edit-task-modal-t1')).toBeInTheDocument();
  });

  it('opens delete modal when Delete button clicked (admin)', async () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  it('does not show admin buttons for employee', () => {
    useAuthStore.getState().login(
      {
        id: 'u2',
        fullName: 'Employee User',
        name: 'Employee',
        email: 'emp@test.com',
        role: 'Employee',
        mustChangePassword: false,
      },
      'token',
    );
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls updateStatus when status changes', async () => {
    const mockUpdateStatus = jest.fn();
    mockUseUpdateTaskStatus.mockReturnValue({
      mutate: mockUpdateStatus,
      isPending: false,
    });
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('radio', { name: 'In Progress' }));

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith({
        id: task.id,
        status: 'In Progress',
      });
    });
  });

  it('calls delete mutation and navigates on confirm', async () => {
    const mockDelete = jest.fn();
    mockUseDeleteTask.mockReturnValue({ mutate: mockDelete, isPending: false });
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockDelete).toHaveBeenCalledWith(task.id, expect.any(Object));
  });

  it('shows due date with overdue indicator', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getAllByText(/Due/)).toHaveLength(2);
  });

  it('shows no project when projectDetails is missing', () => {
    const taskNoProject = { ...task, projectDetails: undefined };
    mockUseTask.mockReturnValue({ data: taskNoProject, isLoading: false });
    renderAt();
    expect(screen.getByText('No project')).toBeInTheDocument();
  });
});
