import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notification.service';

export const useNotifications = () =>
  useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: getNotifications,
    refetchInterval: 30000,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
};
