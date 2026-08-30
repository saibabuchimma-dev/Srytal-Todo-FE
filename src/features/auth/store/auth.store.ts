import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: AuthUser, token?: string, refreshToken?: string) => void;
  setSession: (accessToken: string, refreshToken: string) => void;
  logout: () => void;

  updateUser: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      login: (user, token, refreshToken) =>
        set({
          user: {
            ...user,
            token: token ?? user.token,
            refreshToken: refreshToken ?? user.refreshToken,
          },
          token: token ?? user.token ?? null,
          refreshToken: refreshToken ?? user.refreshToken ?? null,
        }),

      setSession: (accessToken, refreshToken) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                token: accessToken,
                refreshToken,
              }
            : null,
          token: accessToken,
          refreshToken,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
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
