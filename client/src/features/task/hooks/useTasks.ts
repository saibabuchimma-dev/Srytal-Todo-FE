import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { createTask, deleteTask, getTask, getTasks, updateTask } from '../services/task.service';
import type { CreateTaskPayload, TaskQueryParams, UpdateTaskPayload } from '../types/task';

export const useTasks = (params: TaskQueryParams = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.TASKS, params],
    queryFn: () => getTasks(params),
  });

export const useTask = (taskId: number) =>
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
    mutationFn: ({ taskId, payload }: { taskId: number; payload: UpdateTaskPayload }) =>
      updateTask({ taskId, payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};
