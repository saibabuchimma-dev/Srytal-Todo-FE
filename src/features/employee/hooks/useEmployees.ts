import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from '../services/employee.service';
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../types/employee';

export const useEmployees = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
    enabled: options?.enabled ?? true,
  });

export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.EMPLOYEES, employeeId],
    queryFn: () => getEmployee(employeeId),
    enabled: Boolean(employeeId),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEES,
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      updateEmployee(id, payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEES,
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(employeeId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEES,
      });
    },
  });
}
