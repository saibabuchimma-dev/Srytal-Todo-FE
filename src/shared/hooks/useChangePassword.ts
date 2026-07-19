import { useMutation } from '@tanstack/react-query';

import { changePassword } from '@/features/auth/services/auth.service';
import type { ChangePasswordRequest } from '@/features/auth/types/auth';

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  });
}
