import api from '@/shared/services/api';
import type {
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UserRole,
} from '../types/auth';

type AuthPayload = LoginResponse['data'];

const normalizeAuthUser = (user: AuthPayload['user']): AuthUser => ({
  id: user.id,
  fullName: user.fullName,
  name: user.fullName,
  email: user.email,
  role: user.role as UserRole,
  mustChangePassword: user.mustChangePassword,
});

const toSession = (payload: AuthPayload): AuthSession => {
  if (!payload.accessToken || !payload.user) {
    throw new Error('Invalid login response');
  }

  return {
    user: {
      ...normalizeAuthUser(payload.user),
      token: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
};

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return toSession(response.data.data).user;
};

export const refresh = async (refreshToken: string): Promise<AuthSession> => {
  const response = await api.post<LoginResponse>(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true },
  );
  return toSession(response.data.data);
};

export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await api.post('/auth/logout', { refreshToken });
  } catch (_error) {
    void _error;
  }
};

export const changePassword = async (payload: ChangePasswordRequest) => {
  const response = await api.patch('/employees/change-password', payload);
  return response.data;
};
