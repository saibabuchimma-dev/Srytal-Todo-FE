import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { createEmployee, getEmployee, getEmployees } from '../services/employee.service';
import type { CreateEmployeePayload } from '../types/employee';

export function useEmployees() {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEES,
    queryFn: getEmployees,
  });
}

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
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
}
