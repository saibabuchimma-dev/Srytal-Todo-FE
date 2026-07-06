import api from '@/shared/services/api';
import type { CreateTaskPayload, Task, TaskQueryParams, UpdateTaskPayload } from '../types/task';

const normalizeTask = (item: Record<string, unknown>): Task => ({
  id: String(item._id ?? item.id ?? ''),
  _id: typeof item._id === 'string' ? item._id : undefined,
  assignedTo: typeof item.assignedTo === 'string' ? item.assignedTo : null,
  createdBy: typeof item.createdBy === 'string' ? item.createdBy : null,
  title: String(item.title ?? ''),
  description: String(item.description ?? ''),
  priority: (item.priority as Task['priority']) ?? 'Medium',
  status: (item.status as Task['status']) ?? 'Pending',
  dueDate: String(item.dueDate ?? ''),
  createdAt: String(item.createdAt ?? ''),
  updatedAt: String(item.updatedAt ?? ''),
});

const normalizeTaskList = (payload: unknown): Task[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeTask(item as Record<string, unknown>));
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return data.map((item) => normalizeTask(item as Record<string, unknown>));
    }
  }

  return [];
};

export const getTasks = async (params: TaskQueryParams = {}): Promise<Task[]> => {
  const endpoint = params.scope === 'my' ? '/tasks/my-tasks' : '/tasks';
  const response = await api.get<unknown>(endpoint, {
    params: params.scope ? { ...params, scope: undefined } : params,
  });
  return normalizeTaskList(response.data);
};

export const getTask = async (taskId: string): Promise<Task> => {
  const response = await api.get<unknown>(`/tasks/${taskId}`);
  const payload =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeTask((payload ?? {}) as Record<string, unknown>);
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<unknown>('/tasks', payload);
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeTask((data ?? {}) as Record<string, unknown>);
};

export const updateTask = async ({
  taskId,
  payload,
}: {
  taskId: string;
  payload: UpdateTaskPayload;
}): Promise<Task> => {
  const response = await api.put<unknown>(`/tasks/${taskId}`, payload);
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeTask((data ?? {}) as Record<string, unknown>);
};

export const updateTaskStatus = async ({
  taskId,
  status,
}: {
  taskId: string;
  status: Task['status'];
}): Promise<Task> => {
  const response = await api.patch<unknown>(`/tasks/${taskId}/status`, { status });
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeTask((data ?? {}) as Record<string, unknown>);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
