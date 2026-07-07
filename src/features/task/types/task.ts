export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignedTo?: string;
  assignedEmployee?: {
    id: string;
    fullName: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface TaskApiResponse {
  _id?: string;
  id?: string;

  title?: string;
  description?: string;

  status?: 'Pending' | 'In Progress' | 'Completed';

  priority?: 'Low' | 'Medium' | 'High';

  dueDate?: string;

  assignedTo?:
    | string
    | {
        _id: string;
        fullName: string;
      };

  createdAt?: string;
  updatedAt?: string;
}

export interface TaskListResponse {
  success: boolean;
  data: TaskApiResponse[];
}
