import api from '@/shared/services/api';
import type { AppNotification, NotificationApiResponse } from '../types/notification';

const normalizeNotification = (item: NotificationApiResponse): AppNotification => ({
  id: String(item._id ?? item.id ?? ''),
  type: item.type ?? 'COMMENT_ADDED',
  message: item.message ?? '',
  isRead: !!item.isRead,
  taskId: typeof item.task === 'string' ? item.task : (item.task?._id ?? undefined),
  actor:
    item.actor && typeof item.actor === 'object'
      ? { id: item.actor._id, fullName: item.actor.fullName, avatar: item.actor.avatar }
      : undefined,
  createdAt: item.createdAt,
});

export const getNotifications = async (): Promise<AppNotification[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: NotificationApiResponse[];
  }>('/notifications');

  return (data.data ?? []).map(normalizeNotification);
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
