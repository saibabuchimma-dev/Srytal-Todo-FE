export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskSortOption = 'Newest' | 'Oldest' | 'Due Date';

export interface AssignedEmployee {
  id: string;
  fullName: string;
}

export interface AssignedProject {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate: string;

  assignedTo?: string;

  assignedEmployee?: AssignedEmployee;

  project?: string;

  projectDetails?: AssignedProject;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;

  assignedTo?: string;

  project?: string;

  priority: TaskPriority;

  status: TaskStatus;

  dueDate: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface TaskApiResponse {
  _id?: string;
  id?: string;

  title?: string;
  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  dueDate?: string;

  assignedTo?:
    | string
    | {
        _id: string;
        fullName: string;
      }
    | null;

  project?:
    | string
    | {
        _id: string;
        name: string;
      }
    | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface TaskListResponse {
  success: boolean;
  data: TaskApiResponse[];
}
