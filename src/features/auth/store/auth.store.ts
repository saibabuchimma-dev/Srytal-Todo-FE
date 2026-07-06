import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  mustChangePassword: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  setMustChangePassword: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      mustChangePassword: false,

      login: (user, token) =>
        set({
          user: { ...user, token: token ?? user.token ?? undefined },
          token: token ?? user.token ?? null,
          mustChangePassword: Boolean(user.mustChangePassword),
        }),

      logout: () => set({ user: null, token: null, mustChangePassword: false }),
      setMustChangePassword: (value) => set({ mustChangePassword: value }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
