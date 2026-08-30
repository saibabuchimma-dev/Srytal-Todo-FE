jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), patch: jest.fn() },
}));

import api from '@/shared/services/api';
import { login, changePassword } from '@/features/auth/services/auth.service';

const mockApi = api as unknown as { post: jest.Mock; patch: jest.Mock };

describe('auth.service', () => {
  it('login normalizes the user and attaches the access token', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'tok',
          refreshToken: 'refresh',
          mustChangePassword: false,
          user: { id: 'u1', fullName: 'Sravani', email: 's@x.com', role: 'Admin', avatar: 'a.png', mustChangePassword: false },
        },
      },
    });
    const user = await login({ email: 's@x.com', password: 'pw' });
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login', { email: 's@x.com', password: 'pw' });
    expect(user).toMatchObject({ id: 'u1', name: 'Sravani', fullName: 'Sravani', role: 'Admin', token: 'tok', refreshToken: 'refresh' });
  });

  it('login throws when token or user is missing', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { accessToken: '', user: null } } });
    await expect(login({ email: 'x', password: 'y' })).rejects.toThrow('Invalid login response');
  });

  it('changePassword patches and returns the response data', async () => {
    mockApi.patch.mockResolvedValueOnce({ data: { success: true } });
    const result = await changePassword({ currentPassword: 'a', newPassword: 'b', confirmPassword: 'b' });
    expect(mockApi.patch).toHaveBeenCalledWith('/employees/change-password', expect.any(Object));
    expect(result).toEqual({ success: true });
  });
});
