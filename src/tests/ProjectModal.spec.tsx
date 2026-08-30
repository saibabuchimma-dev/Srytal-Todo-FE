const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/features/project/hooks/useProjects', () => ({
  useCreateProject: () => ({ mutate: mockCreate, isPending: false }),
  useUpdateProject: () => ({ mutate: mockUpdate, isPending: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import ProjectModal from '@/features/project/components/ProjectModal';
import type { Project } from '@/features/project/types/project';

const project: Project = {
  id: 'p1',
  name: 'Website Redesign',
  description: 'A long enough description',
  status: 'In Progress',
  startDate: '2026-01-01',
  endDate: '2026-03-01',
  members: [],
};

describe('ProjectModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders create mode', () => {
    renderWithProviders(<ProjectModal opened onClose={jest.fn()} />, { withRouter: false });
    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument();
    expect(screen.getByText('Set up a new project and timeline.')).toBeInTheDocument();
  });

  it('pre-fills and updates in edit mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectModal opened onClose={jest.fn()} mode="edit" project={project} />, { withRouter: false });
    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Website Redesign')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update Project' }));
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('closes via Cancel', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithProviders(<ProjectModal opened onClose={onClose} />, { withRouter: false });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });
});
