import api from '@/shared/services/api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Profile, UpdateProfilePayload } from '../types/profile';

interface MeResponse {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

const fallbackProfile = (): Profile => {
  const user = useAuthStore.getState().user;

  return {
    id: user?.id ?? '',
    name: user?.fullName ?? user?.name ?? 'User',
    email: user?.email ?? '',
    role: user?.role ?? 'Employee',
    avatar: user?.avatar ?? '',
    isActive: true,
  };
};

const normalizeProfile = (data: MeResponse): Profile => ({
  id: String(data._id ?? data.id ?? ''),
  name: data.fullName ?? 'User',
  email: data.email ?? '',
  role: data.role ?? 'Employee',
  avatar: data.avatar ?? '',
  isActive: data.isActive ?? true,
  lastLogin: data.lastLogin,
  createdAt: data.createdAt,
});

export const getProfile = async (): Promise<Profile> => {
  try {
    const { data } = await api.get<{ success: boolean; data: MeResponse }>('/employees/me');
    return normalizeProfile(data.data);
  } catch {
    return fallbackProfile();
  }
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<Profile> => {
  const { data } = await api.patch<{ success: boolean; data: MeResponse }>('/employees/me', payload);
  return normalizeProfile(data.data);
};
