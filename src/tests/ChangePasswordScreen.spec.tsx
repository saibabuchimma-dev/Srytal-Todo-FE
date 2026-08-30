const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('@/features/auth/services/auth.service', () => ({ changePassword: jest.fn() }));
jest.mock('@/shared/utils/toast', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { renderWithProviders, screen, userEvent, waitFor } from '@test-utils';
import ChangePasswordScreen from '@/features/auth/screens/ChangePasswordScreen';
import { changePassword } from '@/features/auth/services/auth.service';
import { toast } from '@/shared/utils/toast';
import { useAuthStore } from '@/features/auth/store/auth.store';

const mockChange = changePassword as jest.Mock;
const mToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Current Password'), 'old');
  await user.type(screen.getByLabelText('New Password'), 'newpass');
  await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
  await user.click(screen.getByRole('button', { name: /update password|change password|save|update/i }));
};

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: true },
      't',
    );
  });

  it('changes password, clears the flag and redirects', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockChange.mockResolvedValueOnce({ success: true });
    renderWithProviders(<ChangePasswordScreen />);

    await submit(user);
    await waitFor(() => expect(mToast.success).toHaveBeenCalled());
    expect(useAuthStore.getState().user?.mustChangePassword).toBe(false);

    jest.advanceTimersByTime(1100);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
    jest.useRealTimers();
  });

  it('shows an error toast on failure', async () => {
    const user = userEvent.setup();
    mockChange.mockRejectedValueOnce(new Error('Wrong current password'));
    renderWithProviders(<ChangePasswordScreen />);
    await submit(user);
    await waitFor(() =>
      expect(mToast.error).toHaveBeenCalledWith('Password Change Failed', 'Wrong current password'),
    );
  });
});
