jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import {
  getProjects,
  getProjectsPage,
  createProject,
  getProject,
  getProjectDetails,
  updateProject,
  getEmployeeProjectTasks,
  deleteProject,
  getMyProjects,
} from '@/features/project/services/project.service';

const mockApi = api as unknown as Record<'get' | 'post' | 'put' | 'delete', jest.Mock>;

describe('project.service', () => {
  it('getProjects normalizes a bare array with defaults', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [{ _id: 'p1', name: 'A', members: ['m1'] }] });
    const [proj] = await getProjects();
    expect(proj).toMatchObject({ id: 'p1', name: 'A', status: 'Planning', members: ['m1'] });
  });

  it('getProjects normalizes a { data: [...] } envelope', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [{ id: 'p2' }] } });
    expect((await getProjects())[0].id).toBe('p2');
  });

  it('getProjects returns [] for unexpected shapes', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: { not: 'array' } } });
    expect(await getProjects()).toEqual([]);
    mockApi.get.mockResolvedValueOnce({ data: 42 });
    expect(await getProjects()).toEqual([]);
  });

  it('getProjectsPage maps the envelope and the empty case', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { projects: [{ _id: 'p3' }], total: 1, page: 1, limit: 10, totalPages: 1 } });
    expect((await getProjectsPage({ page: 1, limit: 10 })).items[0].id).toBe('p3');

    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getProjectsPage({ page: 2, limit: 5 })).toMatchObject({ items: [], total: 0, page: 2, limit: 5 });
  });

  it('createProject / getProject unwrap { data } and raw', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { _id: 'p4' } } });
    expect((await createProject({ name: 'N', description: 'd', status: 'Planning', startDate: '', endDate: '' })).id).toBe('p4');

    mockApi.get.mockResolvedValueOnce({ data: { _id: 'p5' } });
    expect((await getProject('p5')).id).toBe('p5');
  });

  it('getProjectDetails normalizes project, stats, employees and tasks', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: {
        data: {
          project: { _id: 'p6', name: 'P6' },
          stats: { totalTasks: 3, completed: 1, pending: 1, inProgress: 1 },
          employees: [
            { employee: { _id: 'u1', fullName: 'U', email: 'u@x.com', role: 'Employee', avatar: 'a.png' }, taskCount: 2, tasks: [{ _id: 't1', assignedTo: { _id: 'u1', fullName: 'U', avatar: 'a.png' } }] },
          ],
          tasks: [{ _id: 't2' }],
        },
      },
    });
    const details = await getProjectDetails('p6');
    expect(details.project.id).toBe('p6');
    expect(details.stats.totalTasks).toBe(3);
    expect(details.employees[0].employee.fullName).toBe('U');
    expect(details.employees[0].tasks[0].assignedTo?._id).toBe('u1');
    expect(details.tasks[0]._id).toBe('t2');
  });

  it('getProjectDetails falls back to defaults when data is missing', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    const details = await getProjectDetails('p7');
    expect(details.stats).toEqual({ totalTasks: 0, completed: 0, pending: 0, inProgress: 0 });
    expect(details.employees).toEqual([]);
    expect(details.tasks).toEqual([]);
  });

  it('updateProject puts and normalizes', async () => {
    mockApi.put.mockResolvedValueOnce({ data: { data: { _id: 'p8' } } });
    expect((await updateProject('p8', { name: 'N', description: 'd', status: 'Planning', startDate: '', endDate: '' })).id).toBe('p8');
  });

  it('getEmployeeProjectTasks returns normalized tasks and [] fallback', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [{ _id: 't9' }] } });
    expect((await getEmployeeProjectTasks('p9', 'u9'))[0]._id).toBe('t9');

    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getEmployeeProjectTasks('p9', 'u9')).toEqual([]);
  });

  it('deleteProject and getMyProjects', async () => {
    mockApi.delete.mockResolvedValueOnce({});
    await deleteProject('p10');
    expect(mockApi.delete).toHaveBeenCalledWith('/projects/p10');

    mockApi.get.mockResolvedValueOnce({ data: [{ _id: 'p11' }] });
    expect((await getMyProjects())[0].id).toBe('p11');
  });
});
