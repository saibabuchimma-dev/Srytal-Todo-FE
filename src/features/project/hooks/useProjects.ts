import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { createProject, getProject, getProjects } from '../services/project.service';
import type { CreateProjectPayload, ProjectQueryParams } from '../types/project';

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

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
    },
  });
};
