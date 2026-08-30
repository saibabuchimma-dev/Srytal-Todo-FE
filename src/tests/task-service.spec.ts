jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksPage,
  getMyTasks,
} from '@/features/task/services/task.service';

const mockApi = api as unknown as Record<'get' | 'post' | 'put' | 'delete', jest.Mock>;

describe('task.service', () => {
  it('getTasks normalizes populated assignedTo/project objects', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: 't1',
            title: 'T',
            assignedTo: { _id: 'u1', fullName: 'User' },
            project: { _id: 'p1', name: 'Proj' },
          },
        ],
      },
    });
    const [task] = await getTasks();
    expect(task.assignedTo).toBe('u1');
    expect(task.assignedEmployee).toEqual({ id: 'u1', fullName: 'User' });
    expect(task.project).toBe('p1');
    expect(task.projectDetails).toEqual({ id: 'p1', name: 'Proj' });
  });

  it('getTasks normalizes string refs and a bare array payload, applying defaults', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ id: 't2', assignedTo: 'u2', project: 'p2' }],
    });
    const [task] = await getTasks();
    expect(task).toMatchObject({ id: 't2', status: 'Pending', priority: 'Medium', assignedTo: 'u2', project: 'p2' });
    expect(task.assignedEmployee).toBeUndefined();
    expect(task.projectDetails).toBeUndefined();
  });

  it('getTask unwraps { data }', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: { _id: 't3', title: 'X' } } });
    expect((await getTask('t3')).title).toBe('X');
    expect(mockApi.get).toHaveBeenCalledWith('/tasks/t3');
  });

  it('createTask posts payload', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { _id: 't4' } } });
    const created = await createTask({ title: 'N', description: 'd', priority: 'Low', status: 'Pending', dueDate: '2026-01-01' });
    expect(mockApi.post).toHaveBeenCalledWith('/tasks', expect.objectContaining({ title: 'N' }));
    expect(created.id).toBe('t4');
  });

  it('updateTask puts payload', async () => {
    mockApi.put.mockResolvedValueOnce({ data: { data: { _id: 't5' } } });
    await updateTask('t5', { title: 'U' });
    expect(mockApi.put).toHaveBeenCalledWith('/tasks/t5', { title: 'U' });
  });

  it('deleteTask deletes', async () => {
    mockApi.delete.mockResolvedValueOnce({});
    await deleteTask('t6');
    expect(mockApi.delete).toHaveBeenCalledWith('/tasks/t6');
  });

  it('getTasksPage maps envelope and empty', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { tasks: [{ _id: 't7' }], total: 1, page: 1, limit: 10, totalPages: 1 } });
    const page = await getTasksPage({ page: 1, limit: 10 });
    expect(page.items[0].id).toBe('t7');

    mockApi.get.mockResolvedValueOnce({ data: {} });
    const empty = await getTasksPage({ page: 4, limit: 15 });
    expect(empty).toMatchObject({ items: [], total: 0, page: 4, limit: 15, totalPages: 1 });
  });

  it('getMyTasks maps the data array', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [{ _id: 't8' }] } });
    const tasks = await getMyTasks();
    expect(mockApi.get).toHaveBeenCalledWith('/tasks/my-tasks');
    expect(tasks[0].id).toBe('t8');
  });
});
