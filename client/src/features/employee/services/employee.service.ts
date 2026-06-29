import api from '@/shared/services/api';
import type { Employee } from '../types/employee';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  return response.data;
};
