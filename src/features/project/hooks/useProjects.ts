import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import {
  createProject,
  deleteProject,
  getEmployeeProjectTasks,
  getProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from '../services/project.service';
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

export const useProjectDetails = (projectId: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, projectId, 'details'],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });

export const useEmployeeProjectTasks = (projectId: string, employeeId: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, projectId, employeeId, 'tasks'],
    queryFn: () => getEmployeeProjectTasks(projectId, employeeId),
    enabled: !!projectId && !!employeeId,
  });

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: CreateProjectPayload }) =>
      updateProject(projectId, payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS,
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS,
      });
    },
  });
};
