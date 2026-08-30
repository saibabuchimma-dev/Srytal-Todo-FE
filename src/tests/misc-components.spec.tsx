const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import { Routes, Route } from 'react-router-dom';
import { render, renderWithProviders, screen, userEvent, fireEvent } from '@test-utils';
import TaskSearch from '@/features/task/components/TaskSearch';
import TaskDetailsModal from '@/features/task/components/TaskDetailsModal';
import ProjectTasksTable from '@/features/project/components/ProjectTasksTable';
import EmployeeHeader from '@/features/employee/components/EmployeeHeader';
import EmployeeTable from '@/features/employee/components/EmployeeTable';
import TaskList from '@/features/task/components/TaskList';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import ProfilePage from '@/features/profile/screens/ProfilePage';
import LoginHero from '@/features/auth/components/LoginHero';
import AnimatedLogin from '@/features/auth/components/AnimatedLogin';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEmployeeStore } from '@/features/employee/store/employee.store';

beforeEach(() => jest.clearAllMocks());

describe('TaskSearch', () => {
  it('calls onChange when typing', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<TaskSearch value="" onChange={onChange} />, { withRouter: false });
    await user.type(screen.getByPlaceholderText('Search task...'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });
});

describe('TaskDetailsModal', () => {
  const task = { _id: 't1', title: 'Task X', description: '', status: 'Pending', priority: 'High', dueDate: '2026-02-01', createdAt: '', assignedTo: { _id: 'u1', fullName: 'Emma' } };
  it('returns null without a task', () => {
    renderWithProviders(<TaskDetailsModal opened onClose={jest.fn()} task={null} />, { withRouter: false });
    expect(screen.queryByText('Task Details')).not.toBeInTheDocument();
  });
  it('renders details for a task', () => {
    renderWithProviders(<TaskDetailsModal opened onClose={jest.fn()} task={task as never} />, { withRouter: false });
    expect(screen.getByText('Task Details')).toBeInTheDocument();
    expect(screen.getByText('No description provided.')).toBeInTheDocument();
    expect(screen.getByText('Emma')).toBeInTheDocument();
  });
});

describe('ProjectTasksTable', () => {
  const task = { _id: 't1', title: 'Alpha', description: 'd', status: 'Pending' as const, priority: 'High' as const, dueDate: '2026-02-01', createdAt: '', assignedTo: { _id: 'u1', fullName: 'Emma' } };
  it('renders the empty state', () => {
    renderWithProviders(<ProjectTasksTable tasks={[]} onView={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />, { withRouter: false });
    expect(screen.getByText('No tasks found.')).toBeInTheDocument();
  });
  it('renders rows and fires the action callbacks', async () => {
    const onView = jest.fn(); const onEdit = jest.fn(); const onDelete = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<ProjectTasksTable tasks={[task]} onView={onView} onEdit={onEdit} onDelete={onDelete} />, { withRouter: false });
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); expect(onView).toHaveBeenCalled();
    await user.click(buttons[1]); expect(onEdit).toHaveBeenCalled();
    await user.click(buttons[2]); expect(onDelete).toHaveBeenCalled();
  });
});

describe('EmployeeHeader', () => {
  it('shows a fallback with no selection and details when selected', () => {
    useEmployeeStore.setState({ selectedEmployee: null });
    const { unmount } = renderWithProviders(<EmployeeHeader />, { withRouter: false });
    expect(screen.getByText('No employee selected.')).toBeInTheDocument();
    unmount();

    useEmployeeStore.setState({ selectedEmployee: { id: 'e1', fullName: 'Sravani', email: 's@x.com', role: 'Admin', avatar: '', isActive: true, mustChangePassword: false } });
    renderWithProviders(<EmployeeHeader />, { withRouter: false });
    expect(screen.getByText('Sravani')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});

describe('EmployeeTable', () => {
  const employee = { id: 'e1', fullName: 'Sravani K', email: 's@x.com', role: 'Employee' as const, avatar: '', isActive: true, mustChangePassword: false, createdAt: '2026-01-01' };
  it('renders rows, navigates on row click and fires edit/delete', async () => {
    const onEdit = jest.fn(); const onDelete = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<EmployeeTable employees={[employee]} onEdit={onEdit} onDelete={onDelete} />);
    await user.click(screen.getByText('Sravani K'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/employees/e1');
    await user.click(screen.getByLabelText('Actions'));
    await user.click(await screen.findByText('Edit'));
    expect(onEdit).toHaveBeenCalled();
  });
});

describe('TaskList', () => {
  it('renders a card per task', () => {
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
    renderWithProviders(
      <TaskList tasks={[{ id: 't1', title: 'One', description: 'd', status: 'Pending', priority: 'Low', dueDate: '2026-02-01' }]} />,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
  });
});

describe('ConfirmDeleteModal', () => {
  it('renders the message and fires confirm/cancel', async () => {
    const onConfirm = jest.fn(); const onClose = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<ConfirmDeleteModal opened onClose={onClose} onConfirm={onConfirm} message="Delete this?" />, { withRouter: false });
    expect(screen.getByText('Delete this?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ProfilePage', () => {
  it('redirects to settings based on role', () => {
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
    renderWithProviders(
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/dashboard/settings" element={<div>Admin Settings</div>} />
      </Routes>,
      { route: '/profile' },
    );
    expect(screen.getByText('Admin Settings')).toBeInTheDocument();
  });
});

describe('LoginHero', () => {
  it('renders the brand and features', () => {
    renderWithProviders(<LoginHero />, { withRouter: false });
    expect(screen.getByText('SRYTAL')).toBeInTheDocument();
    expect(screen.getByText('Manage your team')).toBeInTheDocument();
  });
});

describe('AnimatedLogin', () => {
  it('mounts and responds to mouse movement', () => {
    const { container } = render(<AnimatedLogin />);
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
    expect(container.querySelector('.login-shell')).toBeTruthy();
  });
});
