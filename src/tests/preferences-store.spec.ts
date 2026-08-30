import { usePreferencesStore } from '@/shared/store/preferences.store';

describe('usePreferencesStore', () => {
  it('initialises with a detected timezone, default language and notifications', () => {
    const state = usePreferencesStore.getState();
    expect(typeof state.timezone).toBe('string');
    expect(state.timezone.length).toBeGreaterThan(0);
    expect(state.language).toBe('en');
    expect(state.notifications).toEqual({
      taskAssigned: true,
      statusChanges: true,
      comments: true,
    });
  });

  it('setTimezone / setLanguage update their fields', () => {
    usePreferencesStore.getState().setTimezone('Asia/Kolkata');
    expect(usePreferencesStore.getState().timezone).toBe('Asia/Kolkata');

    usePreferencesStore.getState().setLanguage('fr');
    expect(usePreferencesStore.getState().language).toBe('fr');
  });

  it('setNotificationPref toggles a single key without touching the others', () => {
    usePreferencesStore.getState().setNotificationPref('comments', false);
    const notifications = usePreferencesStore.getState().notifications;
    expect(notifications.comments).toBe(false);
    expect(notifications.taskAssigned).toBe(true);
    expect(notifications.statusChanges).toBe(true);
  });
});
