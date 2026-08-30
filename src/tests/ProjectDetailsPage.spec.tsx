const mockUseDetails = jest.fn();
const mockUseEmpTasks = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  useProjectDetails: () => mockUseDetails(),
  useEmployeeProjectTasks: () => mockUseEmpTasks(),
}));
jest.mock('@/features/task/hooks/useTasks', () => ({ useDeleteTask: () => ({ mutate: jest.fn(), isPending: false }) }));
jest.mock('@/features/project/components/ProjectModal', () => ({ __esModule: true, default: () => null }));
jest.mock('@/features/task/components/CreateTaskModal', () => ({ __esModule: true, default: () => null }));

import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '@test-utils';
import ProjectDetailsPage from '@/features/project/screens/ProjectDetailsPage';

const details = {
  project: { id: 'p1', name: 'Website Redesign', description: 'desc', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-03-01', members: [] },
  stats: { totalTasks: 4, completed: 2, pending: 1, inProgress: 1 },
  employees: [],
  tasks: [{ _id: 't1', title: 'Alpha', description: 'd', status: 'Pending', priority: 'High', dueDate: '2026-02-01', createdAt: '' }],
};

const renderAt = () =>
  renderWithProviders(
    <Routes>
      <Route path="/admin/dashboard/projects/:projectId/details" element={<ProjectDetailsPage />} />
    </Routes>,
    { route: '/admin/dashboard/projects/p1/details' },
  );

describe('ProjectDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEmpTasks.mockReturnValue({ data: [] });
  });

  it('shows loading', () => {
    mockUseDetails.mockReturnValue({ isLoading: true });
    renderAt();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error', () => {
    mockUseDetails.mockReturnValue({ isError: true, data: null });
    renderAt();
    expect(screen.getByText('Unable to load project details.')).toBeInTheDocument();
  });

  it('renders the project name, stats and tasks', () => {
    mockUseDetails.mockReturnValue({ data: details, isLoading: false });
    renderAt();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });
});
