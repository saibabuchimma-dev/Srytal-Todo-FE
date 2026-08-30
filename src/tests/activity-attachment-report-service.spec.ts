jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import { getTaskActivities } from '@/features/activity/services/activity.service';
import {
  getTaskAttachments,
  uploadTaskAttachment,
  deleteTaskAttachment,
} from '@/features/attachment/services/attachment.service';
import { getReportOverview } from '@/features/report/services/report.service';

const mockApi = api as unknown as Record<'get' | 'post' | 'delete', jest.Mock>;

describe('activity.service', () => {
  it('normalizes activities with and without a populated actor', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: [{ _id: 'a1', type: 'COMMENT_ADDED', message: 'm', actor: { _id: 'u1', fullName: 'U', avatar: 'x' } }, { id: 'a2' }] },
    });
    const list = await getTaskActivities('t1');
    expect(mockApi.get).toHaveBeenCalledWith('/activities/task/t1');
    expect(list[0].actor).toEqual({ id: 'u1', fullName: 'U', avatar: 'x' });
    expect(list[1]).toMatchObject({ id: 'a2', type: 'STATUS_CHANGED' });
  });

  it('tolerates missing data', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getTaskActivities('t1')).toEqual([]);
  });
});

describe('attachment.service', () => {
  it('getTaskAttachments normalizes populated + string refs and defaults', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: [
        { _id: 'f1', originalName: 'a.png', mimeType: 'image/png', size: 10, url: 'u', task: { _id: 't1' }, uploadedBy: { _id: 'u1', fullName: 'U', avatar: 'x', role: 'Admin' } },
        { id: 'f2', task: 't2' },
      ] },
    });
    const list = await getTaskAttachments('t1');
    expect(list[0]).toMatchObject({ id: 'f1', originalName: 'a.png', taskId: 't1' });
    expect(list[0].uploadedBy?.id).toBe('u1');
    expect(list[1]).toMatchObject({ id: 'f2', originalName: 'file', taskId: 't2', size: 0 });
    expect(list[1].uploadedBy).toBeUndefined();
  });

  it('getTaskAttachments tolerates missing data', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getTaskAttachments('t1')).toEqual([]);
  });

  it('uploadTaskAttachment posts multipart form data', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { _id: 'f3', originalName: 'x' } } });
    const file = new File(['abc'], 'x.txt', { type: 'text/plain' });
    const uploaded = await uploadTaskAttachment('t1', file);
    expect(mockApi.post).toHaveBeenCalledWith(
      '/attachments/task/t1',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    expect(uploaded.id).toBe('f3');
  });

  it('deleteTaskAttachment deletes', async () => {
    mockApi.delete.mockResolvedValueOnce({});
    await deleteTaskAttachment('f1');
    expect(mockApi.delete).toHaveBeenCalledWith('/attachments/f1');
  });
});

describe('report.service', () => {
  it('returns the overview data envelope', async () => {
    const overview = { totalTasks: 5 };
    mockApi.get.mockResolvedValueOnce({ data: { data: overview } });
    expect(await getReportOverview()).toBe(overview);
    expect(mockApi.get).toHaveBeenCalledWith('/reports/overview');
  });
});
