import { useQuery } from '@tanstack/react-query';

import { getTaskActivities } from '../services/activity.service';

export const useTaskActivities = (taskId: string) =>
  useQuery({
    queryKey: ['activities', taskId],
    queryFn: () => getTaskActivities(taskId),
    enabled: !!taskId,
  });
