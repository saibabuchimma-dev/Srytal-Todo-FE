jest.mock('@/features/auth/services/auth.service', () => ({ changePassword: jest.fn() }));
jest.mock('@/shared/utils/toast', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

import { renderWithProviders, screen, userEvent, waitFor } from '@test-utils';
import SecuritySettings from '@/features/settings/components/SecuritySettings';
import { changePassword } from '@/features/auth/services/auth.service';
import { toast } from '@/shared/utils/toast';
import { useAuthStore } from '@/features/auth/store/auth.store';

const mockChange = changePassword as jest.Mock;
const mToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

const fill = async (u: ReturnType<typeof userEvent.setup>, cur: string, nw: string, cf: string) => {
  await u.type(screen.getByLabelText('Current password'), cur);
  await u.type(screen.getByLabelText('New password'), nw);
  await u.type(screen.getByLabelText('Confirm new password'), cf);
  await u.click(screen.getByRole('button', { name: 'Update password' }));
};

describe('SecuritySettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: true },
      't',
    );
  });

  it('rejects a short password', async () => {
    const u = userEvent.setup();
    renderWithProviders(<SecuritySettings />, { withRouter: false });
    await fill(u, 'old', 'short', 'short');
    expect(mToast.error).toHaveBeenCalledWith('Password must be at least 8 characters.');
    expect(mockChange).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords', async () => {
    const u = userEvent.setup();
    renderWithProviders(<SecuritySettings />, { withRouter: false });
    await fill(u, 'old', 'longenough1', 'different1');
    expect(mToast.error).toHaveBeenCalledWith('Passwords do not match.');
  });

  it('changes the password successfully', async () => {
    mockChange.mockResolvedValueOnce({});
    const u = userEvent.setup();
    renderWithProviders(<SecuritySettings />, { withRouter: false });
    await fill(u, 'old', 'longenough1', 'longenough1');
    await waitFor(() => expect(mToast.success).toHaveBeenCalledWith('Password updated'));
    expect(useAuthStore.getState().user?.mustChangePassword).toBe(false);
  });

  it('surfaces a server error', async () => {
    mockChange.mockRejectedValueOnce(new Error('Bad current password'));
    const u = userEvent.setup();
    renderWithProviders(<SecuritySettings />, { withRouter: false });
    await fill(u, 'old', 'longenough1', 'longenough1');
    await waitFor(() => expect(mToast.error).toHaveBeenCalledWith('Bad current password'));
  });
});
