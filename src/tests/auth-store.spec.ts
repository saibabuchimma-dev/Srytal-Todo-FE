import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser } from '@/features/auth/types/auth';

const user: AuthUser = {
  id: 'u1',
  fullName: 'Sravani K',
  name: 'Sravani',
  email: 's@x.com',
  role: 'Employee',
  mustChangePassword: false,
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts logged out', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('login stores user and an explicit token', () => {
    useAuthStore.getState().login(user, 'tok-123');
    const state = useAuthStore.getState();
    expect(state.token).toBe('tok-123');
    expect(state.user?.token).toBe('tok-123');
    expect(state.user?.email).toBe('s@x.com');
  });

  it('login falls back to the token embedded in the user', () => {
    useAuthStore.getState().login({ ...user, token: 'embedded' });
    expect(useAuthStore.getState().token).toBe('embedded');
  });

  it('login with no token anywhere yields a null token', () => {
    useAuthStore.getState().login(user);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('updateUser merges into the current user', () => {
    useAuthStore.getState().login(user, 't');
    useAuthStore.getState().updateUser({ name: 'Updated' });
    expect(useAuthStore.getState().user?.name).toBe('Updated');
  });

  it('updateUser is a no-op when logged out', () => {
    useAuthStore.getState().updateUser({ name: 'X' });
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('logout clears everything', () => {
    useAuthStore.getState().login(user, 't');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
