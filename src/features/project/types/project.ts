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
