const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockUsePaginated = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  usePaginatedProjects: () => mockUsePaginated(),
  useDeleteProject: () => ({ mutate: jest.fn(), isPending: false }),
  useCreateProject: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateProject: () => ({ mutate: jest.fn(), isPending: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import ProjectsPage from '@/features/project/screens/ProjectsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const project = { id: 'p1', name: 'Website Redesign', description: 'desc', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-03-01', members: [] };

const asAdmin = () =>
  useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');

describe('ProjectsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAdmin();
  });

  it('shows loading and error states', () => {
    mockUsePaginated.mockReturnValue({ isLoading: true });
    const { unmount } = renderWithProviders(<ProjectsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    unmount();

    mockUsePaginated.mockReturnValue({ isError: true });
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('Projects could not be loaded.')).toBeInTheDocument();
  });

  it('renders projects for an admin with the create action', async () => {
    mockUsePaginated.mockReturnValue({ data: { items: [project], total: 1, totalPages: 1 }, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /create project/i }));
    expect(await screen.findByText('Set up a new project and timeline.')).toBeInTheDocument();
  });

  it('hides the create action for employees and shows the employee title', () => {
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Employee', mustChangePassword: false }, 't');
    mockUsePaginated.mockReturnValue({ data: { items: [], total: 0, totalPages: 1 }, isLoading: false });
    renderWithProviders(<ProjectsPage />);
    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create project/i })).not.toBeInTheDocument();
  });
});
