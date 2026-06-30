import api from '@/shared/services/api';
import type { AuthUser, LoginRequest } from '../types/auth';

const localAuthUser: AuthUser = {
  email: 'admin@srytal.com',
  password: 'password123',
  name: 'Administrator',
  role: 'Admin',
};

export const login = async (payload: LoginRequest) => {
  try {
    const response = await api.get<AuthUser>('/auth');
    const authUser = response.data;

    if (authUser.email === payload.email && authUser.password === payload.password) {
      return authUser;
    }

    throw new Error('Invalid email or password');
  } catch (error) {
    if (
      error instanceof Error &&
      /ECONNREFUSED|Network Error|ENOTFOUND|connect/i.test(error.message)
    ) {
      if (localAuthUser.email === payload.email && localAuthUser.password === payload.password) {
        return localAuthUser;
      }
      // throw new Error('Invalid email or password');
    }

    throw error instanceof Error ? error : new Error('Invalid email or password');
  }
};
