import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { QUERY_KEYS } from '@/shared/config';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../services/task.service';
import type { CreateTaskPayload, Task, TaskQueryParams, UpdateTaskPayload } from '../types/task';

export const useTasks = (params: TaskQueryParams = {}) => {
  const currentUser = useAuthStore((state) => state.user);
  const resolvedParams =
    currentUser?.role?.toLowerCase() === 'employee' ? { ...params, scope: 'my' as const } : params;

  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, resolvedParams],
    queryFn: () => getTasks(resolvedParams),
  });
};

export const useTask = (taskId: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.TASKS, taskId],
    queryFn: () => getTask(taskId),
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) =>
      updateTask({ taskId, payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus({ taskId, status: status as Task['status'] }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};
