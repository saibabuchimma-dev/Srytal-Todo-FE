import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import {
  getTasks,
  getTask,
  getTasksPage,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
} from '../services/task.service';
import type {
  CreateTaskPayload,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
} from '../types/task';

export const useTasks = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: options?.enabled ?? true,
  });

export const usePaginatedTasks = (params: {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.TASKS, 'page', params],
    queryFn: () => getTasksPage(params),
    placeholderData: keepPreviousData,
  });

export function useTask(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export const useMyTasks = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['my-tasks'],
    queryFn: getMyTasks,
    enabled: options?.enabled ?? true,
  });

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS,
      });

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS,
      });

      if (variables.project) {
        void queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.PROJECTS, variables.project, 'details'],
        });
      }
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS,
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS,
      });

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS,
      });
    },
  });
}
