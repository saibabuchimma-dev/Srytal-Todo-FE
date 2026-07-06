import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token: token ?? user.token ?? null }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
