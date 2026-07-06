import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/utils/toast';

interface ApiErrorResponse {
  message?: string;
}

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
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message ?? error.message;

      toast.error('Request failed', message);
    }

    return Promise.reject(error);
  },
);

export default api;
