import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { getEmployee, getEmployees } from '../services/employee.service';

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
