import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { getNotifications } from '../services/notification.service';

export const useNotifications = () =>
  useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: getNotifications,
    enabled: false,
  });
