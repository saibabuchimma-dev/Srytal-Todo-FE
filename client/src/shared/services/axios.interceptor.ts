import axios from 'axios';
import { toast } from '@/shared/utils/toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    toast.error('Error', message);

    return Promise.reject(error);
  },
);

export default api;
