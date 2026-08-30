import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationPrefs {
  taskAssigned: boolean;
  statusChanges: boolean;
  comments: boolean;
}

interface PreferencesState {
  timezone: string;
  language: string;
  notifications: NotificationPrefs;
  setTimezone: (timezone: string) => void;
  setLanguage: (language: string) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
}

const detectTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      timezone: detectTimezone(),
      language: 'en',
      notifications: {
        taskAssigned: true,
        statusChanges: true,
        comments: true,
      },

      setTimezone: (timezone) => set({ timezone }),
      setLanguage: (language) => set({ language }),
      setNotificationPref: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
    }),
    { name: 'srytal-preferences' },
  ),
);
