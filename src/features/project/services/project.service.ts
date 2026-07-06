import api from '@/shared/services/api';
import type { CreateProjectPayload, Project, ProjectQueryParams } from '../types/project';

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
