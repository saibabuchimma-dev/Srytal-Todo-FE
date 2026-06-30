import { getTasks } from '@/features/employee/services/task.service';
import { useQuery } from '@tanstack/react-query';

export const useTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
