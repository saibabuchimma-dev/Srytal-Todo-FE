import api from '@/shared/services/api';
import type { Paginated } from '@/shared/types/pagination';
import type {
  CreateTaskPayload,
  Task,
  TaskApiResponse,
  TaskListResponse,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
} from '../types/task';

const normalizeTask = (item: TaskApiResponse): Task => ({
  id: String(item._id ?? item.id ?? ''),
  title: item.title ?? '',
  description: item.description ?? '',
  status: item.status ?? 'Pending',
  priority: item.priority ?? 'Medium',
  dueDate: item.dueDate ?? '',
  assignedTo: typeof item.assignedTo === 'string' ? item.assignedTo : (item.assignedTo?._id ?? ''),
  assignedEmployee:
    item.assignedTo && typeof item.assignedTo === 'object'
      ? {
          id: item.assignedTo._id,
          fullName: item.assignedTo.fullName,
        }
      : undefined,

  project: typeof item.project === 'string' ? item.project : (item.project?._id ?? ''),

  projectDetails:
    item.project && typeof item.project === 'object'
      ? {
          id: item.project._id,
          name: item.project.name,
        }
      : undefined,

  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const normalizeTaskList = (payload: TaskApiResponse[] | TaskListResponse): Task[] => {
  const data = Array.isArray(payload) ? payload : (payload.data ?? []);

  return data.map(normalizeTask);
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<{
    success: boolean;
    data: TaskApiResponse[];
  }>('/tasks');
  return normalizeTaskList(response.data);
};

export const getTask = async (taskId: string): Promise<Task> => {
  const response = await api.get<{
    success: boolean;
    data: TaskApiResponse;
  }>(`/tasks/${taskId}`);

  return normalizeTask(response.data.data);
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<{
    success: boolean;
    data: TaskApiResponse;
  }>('/tasks', payload);

  return normalizeTask(response.data.data);
};

export const updateTask = async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
  const response = await api.put<{
    success: boolean;
    data: TaskApiResponse;
  }>(`/tasks/${taskId}`, payload);

  return normalizeTask(response.data.data);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

interface TaskPageResponse {
  tasks?: TaskApiResponse[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const getTasksPage = async (params: {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<Paginated<Task>> => {
  const response = await api.get<TaskPageResponse>('/tasks/search', { params });
  const data = response.data ?? {};

  return {
    items: Array.isArray(data.tasks) ? data.tasks.map(normalizeTask) : [],
    total: Number(data.total ?? 0),
    page: Number(data.page ?? params.page),
    limit: Number(data.limit ?? params.limit),
    totalPages: Number(data.totalPages ?? 1),
  };
};

export const getMyTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: TaskApiResponse[];
  }>('/tasks/my-tasks');

  return data.data.map(normalizeTask);
};
