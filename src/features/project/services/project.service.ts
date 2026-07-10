import api from '@/shared/services/api';
import type {
  CreateProjectPayload,
  EmployeeTaskGroup,
  Project,
  ProjectDetailsResponse,
  ProjectQueryParams,
  ProjectTask,
} from '../types/project';

const normalizeTask = (item: Record<string, unknown>): ProjectTask => ({
  _id: String(item._id ?? ''),
  title: String(item.title ?? ''),
  description: String(item.description ?? ''),
  status: (item.status as ProjectTask['status']) ?? 'Pending',
  priority: (item.priority as ProjectTask['priority']) ?? 'Medium',
  dueDate: String(item.dueDate ?? ''),
  createdAt: String(item.createdAt ?? ''),
});

const normalizeEmployeeTaskGroup = (item: Record<string, unknown>): EmployeeTaskGroup => ({
  employee: {
    _id: String((item.employee as Record<string, unknown>)?._id ?? ''),
    fullName: String((item.employee as Record<string, unknown>)?.fullName ?? ''),
    email: String((item.employee as Record<string, unknown>)?.email ?? ''),
    role: String((item.employee as Record<string, unknown>)?.role ?? ''),
    avatar:
      typeof (item.employee as Record<string, unknown>)?.avatar === 'string'
        ? ((item.employee as Record<string, unknown>).avatar as string)
        : undefined,
  },

  taskCount: Number(item.taskCount ?? 0),

  tasks: Array.isArray(item.tasks)
    ? item.tasks.map((task) => normalizeTask(task as Record<string, unknown>))
    : [],
});

const normalizeProject = (item: Record<string, unknown>): Project => ({
  id: String(item._id ?? item.id ?? ''),
  _id: typeof item._id === 'string' ? item._id : undefined,
  name: String(item.name ?? ''),
  description: String(item.description ?? ''),
  status: (item.status as Project['status']) ?? 'Planning',
  startDate: String(item.startDate ?? ''),
  endDate: String(item.endDate ?? ''),
  members: Array.isArray(item.members) ? item.members.map((member) => String(member)) : [],
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
  updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
});

const normalizeProjectList = (payload: unknown): Project[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeProject(item as Record<string, unknown>));
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return data.map((item) => normalizeProject(item as Record<string, unknown>));
    }
  }

  return [];
};

export const getProjects = async (params: ProjectQueryParams = {}): Promise<Project[]> => {
  const response = await api.get<unknown>('/projects', { params });
  return normalizeProjectList(response.data);
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await api.post<unknown>('/projects', payload);
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeProject((data ?? {}) as Record<string, unknown>);
};

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await api.get<unknown>(`/projects/${projectId}`);
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeProject((data ?? {}) as Record<string, unknown>);
};

export const getProjectDetails = async (projectId: string): Promise<ProjectDetailsResponse> => {
  const response = await api.get(`/projects/${projectId}/details`);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data: Record<string, unknown> }).data
      : {};

  return {
    project: normalizeProject((data.project as Record<string, unknown>) ?? {}),

    stats: (data.stats as ProjectDetailsResponse['stats']) ?? {
      totalTasks: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
    },

    employees: Array.isArray(data.employees)
      ? data.employees.map((employee) =>
          normalizeEmployeeTaskGroup(employee as Record<string, unknown>),
        )
      : [],
  };
};

export const updateProject = async (
  projectId: string,
  payload: CreateProjectPayload,
): Promise<Project> => {
  const response = await api.put(`/projects/${projectId}`, payload);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeProject((data ?? {}) as Record<string, unknown>);
};

export const getEmployeeProjectTasks = async (
  projectId: string,
  employeeId: string,
): Promise<ProjectTask[]> => {
  const response = await api.get(`/projects/${projectId}/employees/${employeeId}/tasks`);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data: unknown[] }).data
      : [];

  return Array.isArray(data)
    ? data.map((task) => normalizeTask(task as Record<string, unknown>))
    : [];
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}`);
};
