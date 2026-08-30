jest.mock('@/features/settings/components/ProfileSettings', () => ({
  __esModule: true,
  default: () => <div>Profile Section</div>,
}));
jest.mock('@/features/settings/components/SecuritySettings', () => ({
  __esModule: true,
  default: () => <div>Security Section</div>,
}));
jest.mock('@/features/settings/components/PreferencesSettings', () => ({
  __esModule: true,
  default: () => <div>Preferences Section</div>,
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import SettingsPage from '@/features/settings/screens/SettingsPage';

describe('SettingsPage', () => {
  it('shows the profile section by default and switches sections', async () => {
    const u = userEvent.setup();
    renderWithProviders(<SettingsPage />, { withRouter: false });
    expect(screen.getByText('Profile Section')).toBeInTheDocument();

    await u.click(screen.getByText('Security'));
    expect(screen.getByText('Security Section')).toBeInTheDocument();

    await u.click(screen.getByText('Preferences'));
    expect(screen.getByText('Preferences Section')).toBeInTheDocument();
  });
});
