import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { refresh } from '@/features/auth/services/auth.service';
import { toast } from '@/shared/utils/toast';

interface ApiErrorResponse {
  message?: string;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skips the automatic access-token refresh for this request. */
    skipAuthRefresh?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      const headers = config.headers ?? {};
      config.headers = axios.AxiosHeaders.from({
        ...headers,
        Authorization: `Bearer ${token}`,
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const status = error.response?.status;
      const original = error.config as RetryConfig | undefined;

      // Attempt single-token-refresh when the access token expires (401)
      // and a refresh token is available. `skipAuthRefresh` prevents infinite loops.
      if (
        status === 401 &&
        original &&
        !original.skipAuthRefresh &&
        !original._retry
      ) {
        const state = useAuthStore.getState();
        const refreshToken = state.refreshToken;

        if (refreshToken) {
          original._retry = true;

          try {
            const session = await refresh(refreshToken);
            useAuthStore.getState().setSession(session.accessToken, session.refreshToken);

            const headers = original.headers ?? {};
            original.headers = axios.AxiosHeaders.from({
              ...headers,
              Authorization: `Bearer ${session.accessToken}`,
            });
            return api(original);
          } catch {
            // Refresh failed — fall through to full logout below.
          }
        }

        useAuthStore.getState().logout();
      }

      const message = error.response?.data?.message ?? error.message;
      toast.error('Request failed', message);
    }

    return Promise.reject(error);
  },
);

export default api;
