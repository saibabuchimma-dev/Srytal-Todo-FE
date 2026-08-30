jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), patch: jest.fn() },
}));

import api from '@/shared/services/api';
import { getProfile, updateMyProfile } from '@/features/profile/services/profile.service';
import { useAuthStore } from '@/features/auth/store/auth.store';

const mockApi = api as unknown as { get: jest.Mock; patch: jest.Mock };

describe('profile.service', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('getProfile normalizes the /employees/me response', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: { _id: 'u1', fullName: 'Sravani', email: 's@x.com', role: 'Admin', avatar: 'a.png', isActive: true } },
    });
    const profile = await getProfile();
    expect(mockApi.get).toHaveBeenCalledWith('/employees/me');
    expect(profile).toMatchObject({ id: 'u1', name: 'Sravani', role: 'Admin', isActive: true });
  });

  it('getProfile falls back to the auth store on error', async () => {
    useAuthStore.getState().login(
      { id: 'u2', fullName: 'Fallback', name: 'Fallback', email: 'f@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
    mockApi.get.mockRejectedValueOnce(new Error('network'));
    const profile = await getProfile();
    expect(profile).toMatchObject({ id: 'u2', name: 'Fallback', email: 'f@x.com', role: 'Employee' });
  });

  it('getProfile fallback uses safe defaults when logged out', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('network'));
    const profile = await getProfile();
    expect(profile).toMatchObject({ id: '', name: 'User', role: 'Employee', isActive: true });
  });

  it('updateMyProfile patches and normalizes', async () => {
    mockApi.patch.mockResolvedValueOnce({ data: { data: { _id: 'u3', fullName: 'New' } } });
    const profile = await updateMyProfile({ name: 'New' });
    expect(mockApi.patch).toHaveBeenCalledWith('/employees/me', { name: 'New' });
    expect(profile).toMatchObject({ id: 'u3', name: 'New' });
  });
});
