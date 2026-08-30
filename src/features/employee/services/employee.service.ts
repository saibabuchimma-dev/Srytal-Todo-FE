import api from '@/shared/services/api';
import type { Paginated } from '@/shared/types/pagination';
import type { CreateEmployeePayload, Employee, UpdateEmployeePayload } from '../types/employee';

const normalizeEmployee = (item: Record<string, unknown>): Employee => ({
  id: String(item._id ?? item.id ?? ''),
  fullName: String(item.fullName ?? ''),
  email: String(item.email ?? ''),
  role: (item.role as 'Admin' | 'Employee') ?? 'Employee',
  avatar: String(item.avatar ?? ''),
  isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
  mustChangePassword:
    typeof item.mustChangePassword === 'boolean' ? item.mustChangePassword : false,
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
  updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
});

const normalizeEmployeeList = (payload: unknown): Employee[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeEmployee(item as Record<string, unknown>));
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: unknown[] }).data.map((item) =>
      normalizeEmployee(item as Record<string, unknown>),
    );
  }

  return [];
};

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  return normalizeEmployeeList(response.data);
};

interface EmployeePageResponse {
  employees?: unknown[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const getEmployeesPage = async (params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<Paginated<Employee>> => {
  const response = await api.get<EmployeePageResponse>('/employees/search', { params });
  const data = response.data ?? {};

  return {
    items: Array.isArray(data.employees)
      ? data.employees.map((item) => normalizeEmployee(item as Record<string, unknown>))
      : [],
    total: Number(data.total ?? 0),
    page: Number(data.page ?? params.page),
    limit: Number(data.limit ?? params.limit),
    totalPages: Number(data.totalPages ?? 1),
  };
};

export const getEmployee = async (employeeId: string): Promise<Employee> => {
  const response = await api.get(`/employees/${employeeId}`);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? response.data.data
      : response.data;

  return normalizeEmployee(data as Record<string, unknown>);
};

export const createEmployee = async (payload: CreateEmployeePayload): Promise<Employee> => {
  const response = await api.post('/employees', payload);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? response.data.data
      : response.data;

  return normalizeEmployee(data as Record<string, unknown>);
};

export const updateEmployee = async (
  employeeId: string,
  payload: UpdateEmployeePayload,
): Promise<Employee> => {
  const response = await api.put(`/employees/${employeeId}`, payload);

  const data =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? response.data.data
      : response.data;

  return normalizeEmployee(data as Record<string, unknown>);
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  await api.delete(`/employees/${employeeId}`);
};
