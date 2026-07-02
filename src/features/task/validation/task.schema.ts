import { z } from 'zod';

import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants/task.constants';

export const taskSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(TASK_PRIORITY_OPTIONS),
  status: z.enum(TASK_STATUS_OPTIONS),
  dueDate: z.string().min(1, 'Due date is required'),
});
