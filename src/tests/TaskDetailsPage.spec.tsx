const mockUseTask = jest.fn();
const mockMutate = jest.fn();
jest.mock('@/features/task/hooks/useTasks', () => ({ useTask: () => mockUseTask() }));
jest.mock('@/features/task/hooks/useUpdateTaskStatus', () => ({
  useUpdateTaskStatus: () => ({ mutate: mockMutate, isPending: false }),
}));
jest.mock('@/features/activity/components/ActivityTimeline', () => ({ __esModule: true, default: () => <div>activity</div> }));
jest.mock('@/features/comment/components/CommentSection', () => ({ __esModule: true, default: () => <div>comments</div> }));

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '@test-utils';
import TaskDetailsPage from '@/features/task/screens/TaskDetailsPage';

const task = { id: 't1', title: 'Design homepage', description: 'Build hero', status: 'Pending', priority: 'High', dueDate: '2020-01-01', projectDetails: { id: 'p1', name: 'Website' } };

const renderAt = () =>
  renderWithProviders(
    <Routes>
      <Route path="/admin/dashboard/tasks/:taskId" element={<TaskDetailsPage />} />
    </Routes>,
    { route: '/admin/dashboard/tasks/t1' },
  );

describe('TaskDetailsPage', () => {
  beforeEach(() => jest.clearAllMocks());

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

  it('renders the task with its details and child sections', () => {
    mockUseTask.mockReturnValue({ data: task, isLoading: false });
    renderAt();
    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getAllByText('Website').length).toBeGreaterThan(0);
    expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    expect(screen.getByText('activity')).toBeInTheDocument();
    expect(screen.getByText('comments')).toBeInTheDocument();
  });
});
