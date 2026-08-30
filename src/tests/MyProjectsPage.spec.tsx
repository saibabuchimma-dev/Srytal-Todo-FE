const mockUseMyProjects = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  useMyProjects: () => mockUseMyProjects(),
}));

import { renderWithProviders, screen } from '@test-utils';
import MyProjectsPage from '@/features/project/screens/MyProjectsPage';

const project = { id: 'p1', name: 'Website', description: 'desc', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-03-01', members: ['m1'] };

describe('MyProjectsPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading', () => {
    mockUseMyProjects.mockReturnValue({ data: [], isLoading: true });
    renderWithProviders(<MyProjectsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseMyProjects.mockReturnValue({ data: [], isError: true });
    renderWithProviders(<MyProjectsPage />);
    expect(screen.getByText('Failed to load your projects.')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    mockUseMyProjects.mockReturnValue({ data: [], isLoading: false });
    renderWithProviders(<MyProjectsPage />);
    expect(screen.getByText('You have no projects assigned yet.')).toBeInTheDocument();
  });

  it('renders assigned projects', () => {
    mockUseMyProjects.mockReturnValue({ data: [project], isLoading: false });
    renderWithProviders(<MyProjectsPage />);
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('1 project assigned to you.')).toBeInTheDocument();
    expect(screen.getByText('1 member')).toBeInTheDocument();
  });
});
