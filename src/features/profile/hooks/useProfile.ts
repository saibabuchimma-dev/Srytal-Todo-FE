import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/utils/toast';
import { getProfile, updateMyProfile } from '../services/profile.service';

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => {
      updateUser({ fullName: profile.name, name: profile.name, avatar: profile.avatar });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (error: AxiosError<{ message: string }>) =>
      toast.error(error.response?.data?.message ?? 'Unable to update profile.'),
  });
};
