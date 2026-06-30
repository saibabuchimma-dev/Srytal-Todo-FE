import api from '@/shared/services/api';
import type { Task } from '../types/task';

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (payload: Task) => {
  const { data } = await api.post('/tasks', payload);
  return data;
};
