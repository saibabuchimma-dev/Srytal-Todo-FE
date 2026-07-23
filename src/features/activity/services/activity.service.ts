import api from '@/shared/services/api';
import type { Activity, ActivityApiResponse } from '../types/activity';

const normalizeActivity = (item: ActivityApiResponse): Activity => ({
  id: String(item._id ?? item.id ?? ''),
  type: item.type ?? 'STATUS_CHANGED',
  message: item.message ?? '',
  actor:
    item.actor && typeof item.actor === 'object'
      ? { id: item.actor._id, fullName: item.actor.fullName, avatar: item.actor.avatar }
      : undefined,
  createdAt: item.createdAt,
});

export const getTaskActivities = async (taskId: string): Promise<Activity[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: ActivityApiResponse[];
  }>(`/activities/task/${taskId}`);

  return (data.data ?? []).map(normalizeActivity);
};
