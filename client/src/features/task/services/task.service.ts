import api from '@/shared/services/api';

import type { CreateTaskPayload, Task, TaskQueryParams, UpdateTaskPayload } from '../types/task';

export const getTasks = async (params: TaskQueryParams = {}): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks', { params });

  return response.data;
};

export const getTask = async (taskId: number): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${taskId}`);

  return response.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<Task>('/tasks', payload);

  return response.data;
};

export const updateTask = async ({
  taskId,
  payload,
}: {
  taskId: number;
  payload: UpdateTaskPayload;
}): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${taskId}`, payload);

  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
