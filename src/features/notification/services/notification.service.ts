import type { AppNotification } from '../types/notification';

export const getNotifications = async (): Promise<AppNotification[]> => {
  // Notifications module is disabled temporarily
  return [];
};
