jest.mock('@/shared/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn(), warning: jest.fn(), info: jest.fn() },
}));

import axios from 'axios';
import api from '@/shared/services/api';
import axiosDefaultReexport from '@/shared/services/axios';
import interceptorReexport from '@/shared/services/axios.interceptor';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/utils/toast';

type Handler = { fulfilled: (v: unknown) => unknown; rejected: (e: unknown) => unknown };
const requestHandler = (api.interceptors.request as unknown as { handlers: Handler[] }).handlers[0];
const responseHandler = (api.interceptors.response as unknown as { handlers: Handler[] }).handlers[0];

describe('api instance', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('configures the base URL from env', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('re-export modules point at the same instance', () => {
    expect(axiosDefaultReexport).toBe(api);
    expect(interceptorReexport).toBe(api);
  });

  it('request interceptor adds a Bearer token when authenticated', () => {
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false },
      'tok-123',
    );
    const config = requestHandler.fulfilled({ headers: {} }) as { headers: { Authorization?: string } };
    expect(config.headers.Authorization).toBe('Bearer tok-123');
  });

  it('request interceptor leaves config untouched without a token', () => {
    const config = requestHandler.fulfilled({ headers: undefined }) as { headers?: { Authorization?: string } };
    expect(config.headers?.Authorization).toBeUndefined();
  });

  it('request interceptor rejects errors', async () => {
    await expect(requestHandler.rejected(new Error('boom'))).rejects.toThrow('boom');
  });

  it('response interceptor passes successful responses through', () => {
    const response = { data: 1 };
    expect(responseHandler.fulfilled(response)).toBe(response);
  });

  it('response interceptor toasts on an axios error and rejects', async () => {
    const err = new axios.AxiosError('Network fail');
    err.response = { data: { message: 'Server says no' } } as never;
    await expect(responseHandler.rejected(err)).rejects.toBe(err);
    expect(toast.error).toHaveBeenCalledWith('Request failed', 'Server says no');
  });

  it('response interceptor rejects non-axios errors without toasting', async () => {
    (toast.error as jest.Mock).mockClear();
    const plain = new Error('plain');
    await expect(responseHandler.rejected(plain)).rejects.toBe(plain);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
