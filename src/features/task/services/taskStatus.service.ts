import api from '@/shared/services/api';
import type { TaskApiResponse } from '../types/task';

export const updateTaskStatus = async (
  taskId: string,
  status: 'Pending' | 'In Progress' | 'Completed',
): Promise<TaskApiResponse> => {
  const response = await api.patch<{
    success: boolean;
    data: TaskApiResponse;
  }>(`/tasks/${taskId}/status`, {
    status,
  });

  return response.data.data;
};
