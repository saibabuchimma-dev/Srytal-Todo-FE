import api from '@/shared/services/api';
import type {
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UserRole,
} from '../types/auth';

const normalizeAuthUser = (user: LoginResponse['data']['user']): AuthUser => ({
  id: user.id,
  fullName: user.fullName,
  name: user.fullName,
  email: user.email,
  role: user.role as UserRole,
  avatar: user.avatar,
  mustChangePassword: user.mustChangePassword,
});

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  const loginData = response.data.data;

  if (!loginData?.token || !loginData?.user) {
    throw new Error('Invalid login response');
  }

  return {
    ...normalizeAuthUser(loginData.user),
    token: loginData.token,
  };
};

export const changePassword = async (payload: ChangePasswordRequest) => {
  const response = await api.patch('/employees/change-password', payload);
  return response.data;
};
