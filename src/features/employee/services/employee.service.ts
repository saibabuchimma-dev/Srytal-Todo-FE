import api from '@/shared/services/api';
import type { CreateEmployeePayload, Employee } from '../types/employee';

const normalizeEmployee = (item: Record<string, unknown>): Employee => ({
  id: String(item._id ?? item.id ?? ''),
  name: String(item.fullName ?? item.name ?? item.email ?? 'Employee'),
  fullName: typeof item.fullName === 'string' ? item.fullName : undefined,
  email: String(item.email ?? ''),
  designation: String(
    item.designation ?? (item.role === 'Admin' ? 'Administrator' : (item.role ?? 'Employee')),
  ),
  avatar: String(item.avatar ?? ''),
  role: typeof item.role === 'string' ? item.role : undefined,
  isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
});

const normalizeEmployeeList = (payload: unknown): Employee[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeEmployee(item as Record<string, unknown>));
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return data.map((item) => normalizeEmployee(item as Record<string, unknown>));
    }
  }

  return [];
};

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<unknown>('/employees');
  return normalizeEmployeeList(response.data);
};

export const getEmployee = async (employeeId: string): Promise<Employee> => {
  const response = await api.get<unknown>(`/employees/${employeeId}`);
  const payload =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeEmployee((payload ?? {}) as Record<string, unknown>);
};

export const createEmployee = async (payload: CreateEmployeePayload): Promise<Employee> => {
  const response = await api.post<unknown>('/employees', payload);
  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data?: Record<string, unknown> }).data
      : response.data;

  return normalizeEmployee((data ?? {}) as Record<string, unknown>);
};
