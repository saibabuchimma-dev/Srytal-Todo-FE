import { useAuthStore } from '@/features/auth/store/auth.store';
import api from '@/shared/services/api';
import type { AdminProfile } from '../types/profile';

export const getProfile = async (): Promise<AdminProfile> => {
  const currentUser = useAuthStore.getState().user;

  const fallbackProfile: AdminProfile = {
    id: currentUser?.id ?? '',
    name: currentUser?.fullName ?? currentUser?.name ?? 'User',
    email: currentUser?.email ?? '',
    role: currentUser?.role ?? 'Employee',
    designation: 'Employee',
    avatar: currentUser?.avatar ?? '',
    phone: '',
    location: '',
  };

  if (currentUser?.id) {
    try {
      const response = await api.get<unknown>(`/employees/${currentUser.id}`);
      const payload =
        response.data && typeof response.data === 'object' && 'data' in response.data
          ? (response.data as { data?: Record<string, unknown> }).data
          : response.data;

      return {
        ...fallbackProfile,
        id: String((payload as Record<string, unknown>)?._id ?? currentUser.id),
        name: String(
          (payload as Record<string, unknown>)?.fullName ??
            currentUser.fullName ??
            currentUser.name ??
            fallbackProfile.name,
        ),
        email: String((payload as Record<string, unknown>)?.email ?? currentUser.email ?? ''),
        role: String((payload as Record<string, unknown>)?.role ?? currentUser.role ?? 'Employee'),
        designation: String(
          (payload as Record<string, unknown>)?.designation ?? fallbackProfile.designation,
        ),
        avatar: String((payload as Record<string, unknown>)?.avatar ?? fallbackProfile.avatar),
        phone: String((payload as Record<string, unknown>)?.phone ?? fallbackProfile.phone),
        location: String(
          (payload as Record<string, unknown>)?.location ?? fallbackProfile.location,
        ),
      };
    } catch {
      return fallbackProfile;
    }
  }

  try {
    const response = await api.get<unknown>('/profile');
    const payload =
      response.data && typeof response.data === 'object' && 'data' in response.data
        ? (response.data as { data?: Record<string, unknown> }).data
        : response.data;

    return {
      ...fallbackProfile,
      id: String((payload as Record<string, unknown>)?._id ?? fallbackProfile.id),
      name: String((payload as Record<string, unknown>)?.fullName ?? fallbackProfile.name),
      email: String((payload as Record<string, unknown>)?.email ?? fallbackProfile.email),
      role: String((payload as Record<string, unknown>)?.role ?? fallbackProfile.role),
      designation: String(
        (payload as Record<string, unknown>)?.designation ?? fallbackProfile.designation,
      ),
      avatar: String((payload as Record<string, unknown>)?.avatar ?? fallbackProfile.avatar),
      phone: String((payload as Record<string, unknown>)?.phone ?? fallbackProfile.phone),
      location: String((payload as Record<string, unknown>)?.location ?? fallbackProfile.location),
    };
  } catch {
    return fallbackProfile;
  }
};
