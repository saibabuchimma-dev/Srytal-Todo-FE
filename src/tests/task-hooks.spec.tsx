jest.mock('@/features/task/services/task.service', () => ({
  getTasks: jest.fn(),
  getTask: jest.fn(),
  getTasksPage: jest.fn(),
  getMyTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

import { renderHook, waitFor, hookWrapper } from '@test-utils';
import * as svc from '@/features/task/services/task.service';
import {
  useTasks,
  usePaginatedTasks,
  useTask,
  useMyTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/features/task/hooks/useTasks';

const mocked = svc as jest.Mocked<typeof svc>;

describe('task hooks (queries)', () => {
  it('useTasks fetches the task list', async () => {
    mocked.getTasks.mockResolvedValueOnce([{ id: 't1' }] as never);
    const { result } = renderHook(() => useTasks(), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 't1' }]);
  });

  it('useTasks respects enabled:false', () => {
    const { result } = renderHook(() => useTasks({ enabled: false }), hookWrapper());
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('usePaginatedTasks fetches a page', async () => {
    mocked.getTasksPage.mockResolvedValueOnce({ items: [], total: 0, page: 1, limit: 10, totalPages: 1 });
    const { result } = renderHook(() => usePaginatedTasks({ page: 1, limit: 10 }), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.getTasksPage).toHaveBeenCalled();
  });

  it('useTask fetches when an id is present and stays idle when empty', async () => {
    mocked.getTask.mockResolvedValueOnce({ id: 't2' } as never);
    const { result } = renderHook(() => useTask('t2'), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: empty } = renderHook(() => useTask(''), hookWrapper());
    expect(empty.current.fetchStatus).toBe('idle');
  });

  it('useMyTasks fetches my tasks', async () => {
    mocked.getMyTasks.mockResolvedValueOnce([] as never);
    const { result } = renderHook(() => useMyTasks(), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('task hooks (mutations)', () => {
  it('useCreateTask invalidates (with a project) on success', async () => {
    mocked.createTask.mockResolvedValueOnce({ id: 't3' } as never);
    const { result } = renderHook(() => useCreateTask(), hookWrapper());
    await result.current.mutateAsync({ title: 'A', description: 'd', priority: 'Low', status: 'Pending', dueDate: '2026-01-01', project: 'p1' });
    expect(mocked.createTask).toHaveBeenCalled();
  });

  it('useCreateTask works without a project (else branch)', async () => {
    mocked.createTask.mockResolvedValueOnce({ id: 't4' } as never);
    const { result } = renderHook(() => useCreateTask(), hookWrapper());
    await result.current.mutateAsync({ title: 'B', description: 'd', priority: 'Low', status: 'Pending', dueDate: '2026-01-01' });
    expect(mocked.createTask).toHaveBeenCalled();
  });

  it('useUpdateTask updates', async () => {
    mocked.updateTask.mockResolvedValueOnce({ id: 't5' } as never);
    const { result } = renderHook(() => useUpdateTask(), hookWrapper());
    await result.current.mutateAsync({ id: 't5', payload: { title: 'U' } });
    expect(mocked.updateTask).toHaveBeenCalledWith('t5', { title: 'U' });
  });

  it('useDeleteTask deletes', async () => {
    mocked.deleteTask.mockResolvedValueOnce();
    const { result } = renderHook(() => useDeleteTask(), hookWrapper());
    await result.current.mutateAsync('t6');
    expect(mocked.deleteTask.mock.calls[0][0]).toBe('t6');
  });
});
