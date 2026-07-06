import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { getProject, getProjects } from '../services/project.service';
import type { ProjectQueryParams } from '../types/project';

export const useProjects = (params: ProjectQueryParams = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, params],
    queryFn: () => getProjects(params),
  });

export const useProject = (projectId: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, projectId],
    queryFn: () => getProject(projectId),
  });
