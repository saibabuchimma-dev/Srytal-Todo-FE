import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;

  updateUser: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) =>
        set({
          user: {
            ...user,
            token: token ?? user.token,
          },
          token: token ?? user.token ?? null,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...data,
              }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
