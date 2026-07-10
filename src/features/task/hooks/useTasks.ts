import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../services/task.service';
import type { CreateTaskPayload, UpdateTaskPayload } from '../types/task';

export function useTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: getTasks,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

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
    },
  });
}
