import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { toast } from '@/shared/utils/toast';
import { updateTaskStatus } from '../services/taskStatus.service';
import type { Task, TaskStatus } from '../types/task';

type UpdateStatusVars = { id: string; status: TaskStatus };

const TASK_LIST_KEYS = [['tasks'], ['my-tasks']] as const;

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusVars) => updateTaskStatus(id, status),

    onMutate: async ({ id, status }: UpdateStatusVars) => {
      const snapshots: Array<{ key: readonly string[]; data: Task[] | undefined }> = [];

      for (const key of TASK_LIST_KEYS) {
        await queryClient.cancelQueries({ queryKey: key });

        const data = queryClient.getQueryData<Task[]>(key);
        snapshots.push({ key, data });

        if (data) {
          queryClient.setQueryData<Task[]>(
            key,
            data.map((task) => (task.id === id ? { ...task, status } : task)),
          );
        }
      }

      return { snapshots };
    },

    onError: (error: AxiosError<{ message: string }>, _variables, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });

      toast.error(error.response?.data?.message ?? 'Unable to update task status.');
    },

    onSuccess: () => {
      toast.success('Task status updated');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};
