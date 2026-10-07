jest.mock('@/shared/utils/toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@/features/auth/services/auth.service', () => ({
  __esModule: true,
  refresh: jest.fn(),
}));

import axios from 'axios';
import api from '@/shared/services/api';
import axiosDefaultReexport from '@/shared/services/axios';
import interceptorReexport from '@/shared/services/axios.interceptor';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/utils/toast';
import { refresh } from '@/features/auth/services/auth.service';

const mockRefresh = refresh as jest.Mock;

type Handler = {
  fulfilled: (v: unknown) => unknown;
  rejected: (e: unknown) => unknown;
};
const requestHandler = (
  api.interceptors.request as unknown as { handlers: Handler[] }
).handlers[0];
const responseHandler = (
  api.interceptors.response as unknown as { handlers: Handler[] }
).handlers[0];

describe('api instance', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    mockRefresh.mockReset();
    (toast.error as jest.Mock).mockClear();
  });

  it('configures the base URL from env', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('re-export modules point at the same instance', () => {
    expect(axiosDefaultReexport).toBe(api);
    expect(interceptorReexport).toBe(api);
  });

  it('request interceptor adds a Bearer token when authenticated', () => {
    useAuthStore.getState().login(
      {
        id: 'u1',
        fullName: 'A',
        name: 'A',
        email: 'a@x.com',
        role: 'Admin',
        mustChangePassword: false,
      },
      'tok-123',
    );
    const config = requestHandler.fulfilled({ headers: {} }) as {
      headers: { Authorization?: string };
    };
    expect(config.headers.Authorization).toBe('Bearer tok-123');
  });

  it('request interceptor leaves config untouched without a token', () => {
    const config = requestHandler.fulfilled({ headers: undefined }) as {
      headers?: { Authorization?: string };
    };
    expect(config.headers?.Authorization).toBeUndefined();
  });

  it('request interceptor rejects errors', async () => {
    await expect(requestHandler.rejected(new Error('boom'))).rejects.toThrow(
      'boom',
    );
  });

  it('response interceptor passes successful responses through', () => {
    const response = { data: 1 };
    expect(responseHandler.fulfilled(response)).toBe(response);
  });

  it('response interceptor toasts on an axios error and rejects', async () => {
    const err = new axios.AxiosError('Network fail');
    err.response = { data: { message: 'Server says no' } } as never;
    await expect(responseHandler.rejected(err)).rejects.toBe(err);
    expect(toast.error).toHaveBeenCalledWith(
      'Request failed',
      'Server says no',
    );
  });

  it('response interceptor rejects non-axios errors without toasting', async () => {
    const plain = new Error('plain');
    await expect(responseHandler.rejected(plain)).rejects.toBe(plain);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('response interceptor handles 401 with valid refresh token - calls refresh and updates tokens', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: false,
      _retry: false,
    };
    const refreshError = new axios.AxiosError('Unauthorized');
    refreshError.response = {
      status: 401,
      data: { message: 'Unauthorized' },
    } as never;
    refreshError.config = originalRequest;

    useAuthStore.getState().setSession('access-token', 'refresh-token-123');

    mockRefresh.mockResolvedValueOnce({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const retryPromise = responseHandler.rejected(refreshError);

    await Promise.resolve();
    expect(mockRefresh).toHaveBeenCalledWith('refresh-token-123');
    const state = useAuthStore.getState();
    expect(state.token).toBe('new-access-token');
    expect(state.refreshToken).toBe('new-refresh-token');
    expect(originalRequest.headers).toHaveProperty(
      'Authorization',
      'Bearer new-access-token',
    );
    expect(originalRequest._retry).toBe(true);

    await expect(retryPromise).rejects.toThrow();
  });

  it('response interceptor logs out when 401 and no refresh token', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: false,
      _retry: false,
    };
    const refreshError = new axios.AxiosError('Unauthorized');
    refreshError.response = {
      status: 401,
      data: { message: 'Unauthorized' },
    } as never;
    refreshError.config = originalRequest;

    useAuthStore.getState().logout();

    await expect(responseHandler.rejected(refreshError)).rejects.toBe(
      refreshError,
    );
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('response interceptor logs out when 401 and refresh fails', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: false,
      _retry: false,
    };
    const refreshError = new axios.AxiosError('Unauthorized');
    refreshError.response = {
      status: 401,
      data: { message: 'Unauthorized' },
    } as never;
    refreshError.config = originalRequest;

    useAuthStore.getState().setSession('access-token', 'refresh-token-123');

    mockRefresh.mockRejectedValueOnce(new Error('Refresh failed'));

    await expect(responseHandler.rejected(refreshError)).rejects.toBe(
      refreshError,
    );
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('response interceptor does NOT logout when 401 and skipAuthRefresh is true', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: true,
      _retry: false,
    };
    const refreshError = new axios.AxiosError('Unauthorized');
    refreshError.response = {
      status: 401,
      data: { message: 'Unauthorized' },
    } as never;
    refreshError.config = originalRequest;

    useAuthStore.getState().setSession('access-token', 'refresh-token-123');

    await expect(responseHandler.rejected(refreshError)).rejects.toBe(
      refreshError,
    );
    const state = useAuthStore.getState();
    expect(state.token).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token-123');
  });

  it('response interceptor does NOT logout when 401 and already retried', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: false,
      _retry: true,
    };
    const refreshError = new axios.AxiosError('Unauthorized');
    refreshError.response = {
      status: 401,
      data: { message: 'Unauthorized' },
    } as never;
    refreshError.config = originalRequest;

    useAuthStore.getState().setSession('access-token', 'refresh-token-123');

    await expect(responseHandler.rejected(refreshError)).rejects.toBe(
      refreshError,
    );
    const state = useAuthStore.getState();
    expect(state.token).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token-123');
  });

  it('response interceptor handles 403 without calling logout', async () => {
    const originalRequest = {
      headers: {},
      skipAuthRefresh: false,
      _retry: false,
    };
    const error = new axios.AxiosError('Forbidden');
    error.response = { status: 403, data: { message: 'Forbidden' } } as never;
    error.config = originalRequest;

    useAuthStore.getState().setSession('access-token', 'refresh-token-123');

    await expect(responseHandler.rejected(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('Request failed', 'Forbidden');
    const state = useAuthStore.getState();
    expect(state.token).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token-123');
  });
});
