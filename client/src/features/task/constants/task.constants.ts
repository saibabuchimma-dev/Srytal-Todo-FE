import type { TaskPriority, TaskSortOption, TaskStatus } from '../types/task';

export const TASK_STATUS_OPTIONS: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
export const TASK_PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_SORT_OPTIONS: TaskSortOption[] = ['Newest', 'Oldest', 'Due Date'];

export const TASK_PAGE_SIZE = 6;

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  Pending: 'gray',
  'In Progress': 'blue',
  Completed: 'green',
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  Low: 'teal',
  Medium: 'yellow',
  High: 'red',
};
