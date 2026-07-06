export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export const TASK_SORT_OPTIONS = ['Newest', 'Oldest', 'Due Date'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskSortOption = (typeof TASK_SORT_OPTIONS)[number];

export interface Task {
  id: string;
  _id?: string;
  assignedTo: string | null;
  createdBy?: string | null;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
};

export type CreateTaskPayload = TaskFormValues & {
  assignedTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTaskPayload = Partial<TaskFormValues> & {
  assignedTo?: string | null;
  updatedAt?: string;
};

export interface TaskQueryParams {
  assignedTo?: string;
  scope?: 'my' | 'all';
}
