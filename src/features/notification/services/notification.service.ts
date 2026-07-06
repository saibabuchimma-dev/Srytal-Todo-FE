import api from '@/shared/services/api';
import type { AppNotification } from '../types/notification';

export const getNotifications = async (): Promise<AppNotification[]> => {
  try {
    const response = await api.get<unknown>('/notifications', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
      },
    });

    const data = response.data;

    if (Array.isArray(data)) {
      return data as AppNotification[];
    }

    if (data && typeof data === 'object' && 'data' in data) {
      const nestedData = (data as { data?: unknown }).data;

      if (Array.isArray(nestedData)) {
        return nestedData as AppNotification[];
      }
    }
  } catch {
    // Ignore notification endpoint failures and keep the UI resilient.
  }

  return [];
};
