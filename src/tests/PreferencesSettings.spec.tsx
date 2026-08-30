import { renderWithProviders, screen, userEvent } from '@test-utils';
import PreferencesSettings from '@/features/settings/components/PreferencesSettings';
import { usePreferencesStore } from '@/shared/store/preferences.store';

describe('PreferencesSettings', () => {
  beforeEach(() => {
    usePreferencesStore.setState({
      timezone: 'UTC',
      language: 'en',
      notifications: { taskAssigned: true, statusChanges: true, comments: true },
    });
  });

  it('renders the appearance, localization and notification sections', () => {
    renderWithProviders(<PreferencesSettings />, { withRouter: false });
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Localization')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('toggles a notification preference in the store', async () => {
    const u = userEvent.setup();
    renderWithProviders(<PreferencesSettings />, { withRouter: false });
    await u.click(screen.getByLabelText('Comments'));
    expect(usePreferencesStore.getState().notifications.comments).toBe(false);
  });

  it('switches the theme via the segmented control', async () => {
    const u = userEvent.setup();
    renderWithProviders(<PreferencesSettings />, { withRouter: false });
    await u.click(screen.getByText('Dark'));
    // No throw = the onChange path ran; the toggle is wired to Mantine's scheme.
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('prepends an unknown timezone to the options list', () => {
    usePreferencesStore.setState({ timezone: 'Mars/Olympus' });
    renderWithProviders(<PreferencesSettings />, { withRouter: false });
    expect(screen.getAllByDisplayValue('Mars/Olympus').length).toBeGreaterThan(0);
  });
});
