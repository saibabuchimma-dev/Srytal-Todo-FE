import api from '@/shared/services/api';
import type { Task } from '../types/task';

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};
