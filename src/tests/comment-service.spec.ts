jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import {
  getTaskComments,
  addTaskComment,
  updateTaskComment,
  deleteTaskComment,
} from '@/features/comment/services/comment.service';

const mockApi = api as unknown as Record<'get' | 'post' | 'patch' | 'delete', jest.Mock>;

describe('comment.service', () => {
  it('getTaskComments normalizes populated author + string/object task refs', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: 'c1', content: 'hi', task: { _id: 't1' }, author: { _id: 'a1', fullName: 'A', email: 'a@x.com', role: 'Admin', avatar: 'x' } },
          { id: 'c2', task: 't2' },
        ],
      },
    });
    const list = await getTaskComments('t1');
    expect(mockApi.get).toHaveBeenCalledWith('/comments/task/t1');
    expect(list[0]).toMatchObject({ id: 'c1', content: 'hi', taskId: 't1' });
    expect(list[0].author?.email).toBe('a@x.com');
    expect(list[1]).toMatchObject({ id: 'c2', taskId: 't2' });
    expect(list[1].author).toBeUndefined();
  });

  it('getTaskComments tolerates missing data', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getTaskComments('t1')).toEqual([]);
  });

  it('addTaskComment posts content', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { _id: 'c3', content: 'new' } } });
    const c = await addTaskComment('t1', 'new');
    expect(mockApi.post).toHaveBeenCalledWith('/comments/task/t1', { content: 'new' });
    expect(c).toMatchObject({ id: 'c3', content: 'new' });
  });

  it('updateTaskComment patches content', async () => {
    mockApi.patch.mockResolvedValueOnce({ data: { data: { _id: 'c4', content: 'edit' } } });
    await updateTaskComment('c4', 'edit');
    expect(mockApi.patch).toHaveBeenCalledWith('/comments/c4', { content: 'edit' });
  });

  it('deleteTaskComment deletes', async () => {
    mockApi.delete.mockResolvedValueOnce({});
    await deleteTaskComment('c5');
    expect(mockApi.delete).toHaveBeenCalledWith('/comments/c5');
  });
});
