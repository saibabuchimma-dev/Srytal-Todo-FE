const mockUseProfile = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
  useUpdateProfile: () => ({ mutate: mockUpdate, isPending: false }),
}));
jest.mock('@/shared/utils/toast', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

import { renderWithProviders, screen, userEvent, fireEvent } from '@test-utils';
import ProfileSettings from '@/features/settings/components/ProfileSettings';
import { toast } from '@/shared/utils/toast';

const mToast = toast as unknown as { error: jest.Mock };
const profile = { id: 'u1', name: 'Sravani', email: 's@x.com', role: 'Admin', avatar: 'data:image/png;base64,x', isActive: true };

const fileInput = (container: HTMLElement) => container.querySelector('input[type="file"]') as HTMLInputElement;

describe('ProfileSettings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the loading state', () => {
    mockUseProfile.mockReturnValue({ data: undefined, isLoading: true });
    renderWithProviders(<ProfileSettings />, { withRouter: false });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders profile info with the save button disabled until dirty', () => {
    mockUseProfile.mockReturnValue({ data: profile, isLoading: false });
    renderWithProviders(<ProfileSettings />, { withRouter: false });
    expect(screen.getByText('Sravani')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s@x.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('enables save after editing the name and submits', async () => {
    mockUseProfile.mockReturnValue({ data: profile, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<ProfileSettings />, { withRouter: false });
    const nameInput = screen.getByLabelText('Full Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).toBeEnabled();
    await user.click(save);
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'New Name' }));
  });

  it('removes the avatar', async () => {
    mockUseProfile.mockReturnValue({ data: profile, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<ProfileSettings />, { withRouter: false });
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });

  it('rejects a non-image file', () => {
    mockUseProfile.mockReturnValue({ data: profile, isLoading: false });
    const { container } = renderWithProviders(<ProfileSettings />, { withRouter: false });
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(fileInput(container), { target: { files: [file] } });
    expect(mToast.error).toHaveBeenCalledWith('Invalid file', 'Please choose an image file.');
  });

  it('rejects an oversized image', () => {
    mockUseProfile.mockReturnValue({ data: profile, isLoading: false });
    const { container } = renderWithProviders(<ProfileSettings />, { withRouter: false });
    const file = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    fireEvent.change(fileInput(container), { target: { files: [file] } });
    expect(mToast.error).toHaveBeenCalledWith('Image too large', 'Please choose an image under 5 MB.');
  });
});
