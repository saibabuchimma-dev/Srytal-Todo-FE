export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  _id?: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  members?: string[];
}

export interface ProjectQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: ProjectStatus;
}

export interface ProjectEmployee {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ProjectTask {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

export interface EmployeeTaskGroup {
  employee: ProjectEmployee;
  taskCount: number;
  tasks: ProjectTask[];
}

export interface ProjectDetailsResponse {
  project: Project;

  stats: {
    totalTasks: number;
    completed: number;
    pending: number;
    inProgress: number;
  };

  employees: EmployeeTaskGroup[];
}
