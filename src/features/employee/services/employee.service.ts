import api from '@/shared/services/api';
import mockDb from '@/mocks/db.json';
import type { Employee } from '../types/employee';

const fallbackEmployees = mockDb.employees as Employee[];

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  } catch (error) {
    if (
      error instanceof Error &&
      /ECONNREFUSED|Network Error|ENOTFOUND|connect/i.test(error.message)
    ) {
      return fallbackEmployees;
    }

    throw error;
  }
};

export const getEmployee = async (employeeId: number): Promise<Employee> => {
  const response = await api.get<Employee>(`/employees/${employeeId}`);

  return response.data;
};
