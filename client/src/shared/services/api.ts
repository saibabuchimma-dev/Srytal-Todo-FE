import axios from 'axios';
import { toast } from '@/shared/utils/toast';

interface ApiErrorResponse {
  message?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
