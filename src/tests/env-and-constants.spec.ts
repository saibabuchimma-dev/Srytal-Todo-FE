import { ENV } from '@/shared/config/env';
import { API } from '@/shared/constants/api';
import { STORAGE_KEYS } from '@/shared/constants/storage';

describe('ENV', () => {
  it('reads Vite env variables', () => {
    expect(ENV.APP_NAME).toBe('Srytal');
    expect(ENV.API_BASE_URL).toBe('http://localhost:5000/api');
    expect(ENV.APP_VERSION).toBe('1.0.0-test');
  });
});

describe('constants', () => {
  it('exposes API path segments', () => {
    expect(API).toEqual({ AUTH: '/auth', EMPLOYEES: '/employees', TASKS: '/tasks' });
  });

  it('exposes storage keys', () => {
    expect(STORAGE_KEYS).toEqual({ TOKEN: 'token', USER: 'user', THEME: 'theme' });
  });
});
