import api from '@/shared/services/api';
import type { AdminProfile } from '../types/profile';

export const getProfile = async (): Promise<AdminProfile> => {
  const response = await api.get<AdminProfile>('/profile');

  return response.data;
};
