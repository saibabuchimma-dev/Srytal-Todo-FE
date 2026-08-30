jest.mock('@/features/project/services/project.service', () => ({
  getProjects: jest.fn(),
  getProjectsPage: jest.fn(),
  getProject: jest.fn(),
  getProjectDetails: jest.fn(),
  getEmployeeProjectTasks: jest.fn(),
  getMyProjects: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
}));

import { renderHook, waitFor, hookWrapper } from '@test-utils';
import * as svc from '@/features/project/services/project.service';
import {
  useProjects,
  usePaginatedProjects,
  useProject,
  useProjectDetails,
  useEmployeeProjectTasks,
  useMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/features/project/hooks/useProjects';

const mocked = svc as jest.Mocked<typeof svc>;

describe('project hooks', () => {
  it('query hooks fetch', async () => {
    mocked.getProjects.mockResolvedValueOnce([] as never);
    const p = renderHook(() => useProjects(), hookWrapper());
    await waitFor(() => expect(p.result.current.isSuccess).toBe(true));

    mocked.getProjectsPage.mockResolvedValueOnce({ items: [], total: 0, page: 1, limit: 10, totalPages: 1 });
    const pg = renderHook(() => usePaginatedProjects({ page: 1, limit: 10 }), hookWrapper());
    await waitFor(() => expect(pg.result.current.isSuccess).toBe(true));

    mocked.getProject.mockResolvedValueOnce({ id: 'p1' } as never);
    const one = renderHook(() => useProject('p1'), hookWrapper());
    await waitFor(() => expect(one.result.current.isSuccess).toBe(true));

    mocked.getMyProjects.mockResolvedValueOnce([] as never);
    const mine = renderHook(() => useMyProjects(), hookWrapper());
    await waitFor(() => expect(mine.result.current.isSuccess).toBe(true));
  });

  it('detail hooks are gated by ids', async () => {
    mocked.getProjectDetails.mockResolvedValueOnce({} as never);
    const d = renderHook(() => useProjectDetails('p1'), hookWrapper());
    await waitFor(() => expect(d.result.current.isSuccess).toBe(true));
    const dOff = renderHook(() => useProjectDetails(''), hookWrapper());
    expect(dOff.result.current.fetchStatus).toBe('idle');

    mocked.getEmployeeProjectTasks.mockResolvedValueOnce([] as never);
    const t = renderHook(() => useEmployeeProjectTasks('p1', 'u1'), hookWrapper());
    await waitFor(() => expect(t.result.current.isSuccess).toBe(true));
    const tOff = renderHook(() => useEmployeeProjectTasks('', ''), hookWrapper());
    expect(tOff.result.current.fetchStatus).toBe('idle');
  });

  it('mutations call their services', async () => {
    mocked.createProject.mockResolvedValueOnce({ id: 'p2' } as never);
    mocked.updateProject.mockResolvedValueOnce({ id: 'p3' } as never);
    mocked.deleteProject.mockResolvedValueOnce();

    const c = renderHook(() => useCreateProject(), hookWrapper());
    await c.result.current.mutateAsync({ name: 'N', description: 'd', status: 'Planning', startDate: '', endDate: '' });
    expect(mocked.createProject).toHaveBeenCalled();

    const u = renderHook(() => useUpdateProject(), hookWrapper());
    await u.result.current.mutateAsync({ projectId: 'p3', payload: { name: 'U', description: 'd', status: 'Planning', startDate: '', endDate: '' } });
    expect(mocked.updateProject).toHaveBeenCalled();

    const del = renderHook(() => useDeleteProject(), hookWrapper());
    await del.result.current.mutateAsync('p4');
    expect(mocked.deleteProject).toHaveBeenCalledWith('p4');
  });
});
