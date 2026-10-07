const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockUsePaginated = jest.fn();
const mockUseDeleteProject = jest.fn();
const mockUseCreateProject = jest.fn();
const mockUseUpdateProject = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  usePaginatedProjects: () => mockUsePaginated(),
  useDeleteProject: () => mockUseDeleteProject(),
  useCreateProject: () => mockUseCreateProject(),
  useUpdateProject: () => mockUseUpdateProject(),
}));
jest.mock('@/features/employee/hooks/useEmployees', () => ({
  useEmployees: () => ({
    data: [{ id: 'e1', fullName: 'Employee 1', email: 'emp1@test.com' }],
    isLoading: false,
  }),
}));
jest.mock('@/features/project/components/ProjectModal', () => ({
  __esModule: true,
  default: ({
    opened,
    onClose,
    project,
    mode,
  }: {
    opened: boolean;
    onClose: () => void;
    project?: { id: string } | null;
    mode?: string;
  }) =>
    opened ? (
      <div data-testid="project-modal">
        project-modal-{mode}-{project?.id}
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

import { renderWithProviders, screen, userEvent } from '@test-utils';
import ProjectsPage from '@/features/project/screens/ProjectsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const project = {
  id: 'p1',
  name: 'Website Redesign',
  description: 'desc',
  status: 'In Progress',
  startDate: '2026-01-01',
  endDate: '2026-03-01',
  members: [],
  memberDetails: [
    { _id: 'e1', fullName: 'John Doe', email: 'john@test.com', avatar: '' },
  ],
};

const projectCompleted = {
  ...project,
  id: 'p2',
  name: 'Completed Project',
  status: 'Completed',
};

const projectPlanning = {
  ...project,
  id: 'p3',
  name: 'Planning Project',
  status: 'Planning',
};

const asAdmin = () =>
  useAuthStore.getState().login(
    {
      id: 'u',
      fullName: 'A',
      name: 'A',
      email: 'a@x.com',
      role: 'Admin',
      mustChangePassword: false,
    },
    't',
  );

const asEmployee = () =>
  useAuthStore.getState().login(
    {
      id: 'u',
      fullName: 'A',
      name: 'A',
      email: 'a@x.com',
      role: 'Employee',
      mustChangePassword: false,
    },
    't',
  );

describe('ProjectsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockUseDeleteProject.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    mockUseCreateProject.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    mockUseUpdateProject.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    asAdmin();
  });

  it('shows loading skeleton', () => {
    mockUsePaginated.mockReturnValue({ isLoading: true });
    const { unmount } = renderWithProviders(<ProjectsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    unmount();
  });

  it('shows error state', () => {
    mockUsePaginated.mockReturnValue({ isError: true });
    renderWithProviders(<ProjectsPage />);
    expect(
      screen.getByText('Projects could not be loaded.'),
    ).toBeInTheDocument();
  });

  it('renders projects for an admin with the create action', async () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [project], total: 1, totalPages: 1 },
      isLoading: false,
    });
    const user = userEvent.setup();
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /create project/i }));
    expect(screen.getByTestId('project-modal')).toBeInTheDocument();
  });

  it('hides the create action for employees and shows the employee title', () => {
    asEmployee();
    mockUsePaginated.mockReturnValue({
      data: { items: [], total: 0, totalPages: 1 },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /create project/i }),
    ).not.toBeInTheDocument();
  });

  it('shows project cards with status badges', () => {
    mockUsePaginated.mockReturnValue({
      data: {
        items: [project, projectCompleted, projectPlanning],
        total: 3,
        totalPages: 1,
      },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Planning').length).toBeGreaterThan(0);
  });

  it('shows member avatars when memberDetails exists', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [project], total: 1, totalPages: 1 },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('shows empty state when no projects match filter', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [], total: 0, totalPages: 1 },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);
    expect(
      screen.getByText('No projects found matching your criteria.'),
    ).toBeInTheDocument();
  });

  it('handles pagination', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [project], total: 25, totalPages: 3 },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('shows view project link on card', () => {
    mockUsePaginated.mockReturnValue({
      data: { items: [project], total: 1, totalPages: 1 },
      isLoading: false,
    });
    renderWithProviders(<ProjectsPage />);

    expect(screen.getByText('View project & tasks')).toBeInTheDocument();
  });
});
