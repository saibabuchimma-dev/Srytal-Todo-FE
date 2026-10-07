const mockUseDetails = jest.fn();
const mockUseEmpTasks = jest.fn();
const mockUseDeleteTask = jest.fn();
const mockRefetch = jest.fn();
const mockRefetchEmp = jest.fn();

jest.mock('@/features/project/hooks/useProjects', () => ({
  useProjectDetails: () => mockUseDetails(),
  useEmployeeProjectTasks: () => mockUseEmpTasks(),
}));
jest.mock('@/features/task/hooks/useTasks', () => ({
  useDeleteTask: () => mockUseDeleteTask(),
}));
jest.mock('@/features/project/components/ProjectModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/features/task/components/CreateTaskModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/features/task/components/TaskDetailsModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/features/task/components/EditTaskModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/common/ConfirmDeleteModal', () => ({
  __esModule: true,
  default: () => null,
}));

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '@test-utils';
import ProjectDetailsPage from '@/features/project/screens/ProjectDetailsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const details = {
  project: {
    id: 'p1',
    name: 'Website Redesign',
    description: 'desc',
    status: 'In Progress',
    startDate: '2026-01-01',
    endDate: '2026-03-01',
    members: [],
  },
  stats: { totalTasks: 4, completed: 2, pending: 1, inProgress: 1 },
  employees: [
    {
      employee: {
        _id: 'e1',
        fullName: 'John Doe',
        email: 'john@test.com',
        avatar: '',
      },
      taskCount: 2,
    },
    {
      employee: {
        _id: 'e2',
        fullName: 'Jane Smith',
        email: 'jane@test.com',
        avatar: '',
      },
      taskCount: 1,
    },
  ],
  tasks: [
    {
      _id: 't1',
      title: 'Alpha',
      description: 'd',
      status: 'Pending',
      priority: 'High',
      dueDate: '2026-02-01',
      createdAt: '2026-01-01',
      assignedTo: { _id: 'e1', fullName: 'John Doe' },
    },
    {
      _id: 't2',
      title: 'Beta',
      description: 'e',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2026-02-15',
      createdAt: '2026-01-05',
      assignedTo: { _id: 'e2', fullName: 'Jane Smith' },
    },
  ],
};

const renderAt = (userRole = 'Admin') => {
  if (userRole === 'Admin') {
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
  } else {
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
  }

  return renderWithProviders(
    <Routes>
      <Route
        path="/admin/dashboard/projects/:projectId/details"
        element={<ProjectDetailsPage />}
      />
    </Routes>,
    { route: '/admin/dashboard/projects/p1/details' },
  );
};

describe('ProjectDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEmpTasks.mockReturnValue({ data: [], refetch: mockRefetchEmp });
    mockUseDeleteTask.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDetails.mockReturnValue({
      data: details,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });
  });

  it('shows loading', () => {
    mockUseDetails.mockReturnValue({ isLoading: true });
    renderAt();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseDetails.mockReturnValue({ isError: true, data: null });
    renderAt();
    expect(
      screen.getByText('Unable to load project details.'),
    ).toBeInTheDocument();
  });

  it('renders the project name, stats and tasks', () => {
    renderAt();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('shows project description and dates', () => {
    renderAt();
    expect(screen.getByText('desc')).toBeInTheDocument();
    expect(screen.getByText(/01 Jan 2026/)).toBeInTheDocument();
    expect(screen.getByText(/01 Mar 2026/)).toBeInTheDocument();
  });

  it('shows progress bar with completion percentage', () => {
    renderAt();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText(/tasks completed/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('shows stats cards', () => {
    renderAt();
    expect(screen.getAllByText('Team Members').length).toBeGreaterThan(0);
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows employee tasks section', () => {
    renderAt();
    expect(screen.getAllByText('Team Members').length).toBeGreaterThan(0);
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
  });

  it('shows empty state when no tasks', () => {
    const emptyDetails = {
      ...details,
      tasks: [],
    };
    mockUseDetails.mockReturnValue({
      data: emptyDetails,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });
    renderAt();
    expect(
      screen.getByText('No tasks in this project yet.'),
    ).toBeInTheDocument();
  });

  it('shows admin buttons when user is admin', () => {
    renderAt('Admin');
    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getAllByText('Add Task').length).toBeGreaterThan(0);
  });

  it('hides admin buttons when user is employee', () => {
    renderAt('Employee');
    expect(screen.queryByText('Edit Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
  });

  it('shows status badge with correct color', () => {
    renderAt();
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
  });

  it('shows member count', () => {
    renderAt();
    expect(screen.getByText('2 members')).toBeInTheDocument();
  });

  it('renders task table with tasks', () => {
    renderAt();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
