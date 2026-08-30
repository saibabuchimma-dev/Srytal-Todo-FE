const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import TaskCard from '@/features/task/components/TaskCard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Task } from '@/features/task/types/task';

const baseTask: Task = {
  id: 't1',
  title: 'Design homepage',
  description: 'Build the new hero section',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2020-01-01', // in the past → overdue
  assignedEmployee: { id: 'e1', fullName: 'Emp One' },
  projectDetails: { id: 'p1', name: 'Website' },
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false },
      't',
    );
  });

  it('renders task details and flags overdue', () => {
    renderWithProviders(<TaskCard task={baseTask} />);
    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    expect(screen.getByText('Emp One')).toBeInTheDocument();
  });

  it('navigates to the admin task details on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCard task={baseTask} />);
    await user.click(screen.getByText('Design homepage'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/tasks/t1');
  });

  it('fires edit and delete callbacks from the menu', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderWithProviders(<TaskCard task={baseTask} onEdit={onEdit} onDelete={onDelete} />);
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(baseTask);

    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(baseTask);
  });

  it('hides the menu in readOnly mode', () => {
    renderWithProviders(<TaskCard task={{ ...baseTask, status: 'Completed', dueDate: '' }} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
