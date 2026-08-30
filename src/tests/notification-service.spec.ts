jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/features/notification/services/notification.service';

const mockApi = api as unknown as Record<'get' | 'patch' | 'delete', jest.Mock>;

describe('notification.service', () => {
  it('getNotifications normalizes populated + string task refs and defaults', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: 'n1', type: 'TASK_ASSIGNED', message: 'm', isRead: 1, task: { _id: 't1' }, actor: { _id: 'a1', fullName: 'A', avatar: 'x' } },
          { id: 'n2', task: 't2' },
        ],
      },
    });
    const list = await getNotifications();
    expect(mockApi.get).toHaveBeenCalledWith('/notifications');
    expect(list[0]).toMatchObject({ id: 'n1', taskId: 't1', isRead: true });
    expect(list[0].actor).toEqual({ id: 'a1', fullName: 'A', avatar: 'x' });
    expect(list[1]).toMatchObject({ id: 'n2', type: 'COMMENT_ADDED', taskId: 't2', isRead: false });
    expect(list[1].actor).toBeUndefined();
  });

  it('getNotifications tolerates a missing data array', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    expect(await getNotifications()).toEqual([]);
  });

  it('mutations hit the right endpoints', async () => {
    mockApi.patch.mockResolvedValue({});
    mockApi.delete.mockResolvedValue({});
    await markNotificationRead('n1');
    expect(mockApi.patch).toHaveBeenCalledWith('/notifications/n1/read');
    await markAllNotificationsRead();
    expect(mockApi.patch).toHaveBeenCalledWith('/notifications/read-all');
    await deleteNotification('n1');
    expect(mockApi.delete).toHaveBeenCalledWith('/notifications/n1');
  });
});
