import api from '@/shared/services/api';
import type { AppNotification } from '../types/notification';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get<AppNotification[]>('/notifications', {
    params: {
      _sort: 'createdAt',
      _order: 'desc',
    },
  });

  return response.data;
};
