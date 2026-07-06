import api from '@/shared/services/api';
import type { AuthUser, LoginRequest, LoginResponse } from '../types/auth';

const normalizeAuthUser = (user: Partial<AuthUser> | null | undefined): AuthUser => ({
  id: user?.id ?? '',
  fullName: user?.fullName ?? user?.name ?? '',
  name: user?.name ?? user?.fullName ?? '',
  email: user?.email ?? '',
  role: user?.role ?? 'Employee',
  avatar: user?.avatar,
});

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  const loginData = response.data?.data;

  if (!loginData?.token || !loginData?.user) {
    throw new Error('Invalid login response');
  }

  return {
    ...normalizeAuthUser(loginData.user),
    token: loginData.token,
  };
};
