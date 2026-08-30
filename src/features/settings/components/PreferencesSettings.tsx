import {
  Card,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';

import { usePreferencesStore } from '@/shared/store/preferences.store';

const TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
];

export default function PreferencesSettings() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const timezone = usePreferencesStore((state) => state.timezone);
  const setTimezone = usePreferencesStore((state) => state.setTimezone);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const notifications = usePreferencesStore((state) => state.notifications);
  const setNotificationPref = usePreferencesStore((state) => state.setNotificationPref);

  const timezoneOptions = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES];

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={5}>Appearance</Title>
          <Group justify="space-between" align="center">
            <div>
              <Text fw={600}>Theme</Text>
              <Text size="sm" c="dimmed">
                Choose light, dark, or match your system.
              </Text>
            </div>

            <SegmentedControl
              value={colorScheme}
              onChange={(value) => setColorScheme(value as 'light' | 'dark' | 'auto')}
              data={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'Auto', value: 'auto' },
              ]}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={5}>Localization</Title>

          <Select
            label="Timezone"
            description="Used to display dates and times across the app."
            searchable
            value={timezone}
            onChange={(value) => value && setTimezone(value)}
            data={timezoneOptions}
          />

          <Select
            label="Language"
            description="More languages coming soon."
            value={language}
            onChange={(value) => value && setLanguage(value)}
            data={[{ label: 'English', value: 'en' }]}
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={5}>Notifications</Title>
          <Text size="sm" c="dimmed">
            Choose which notifications appear in your bell.
          </Text>

          <Switch
            label="Task assignments"
            checked={notifications.taskAssigned}
            onChange={(event) => setNotificationPref('taskAssigned', event.currentTarget.checked)}
          />
          <Switch
            label="Status changes"
            checked={notifications.statusChanges}
            onChange={(event) => setNotificationPref('statusChanges', event.currentTarget.checked)}
          />
          <Switch
            label="Comments"
            checked={notifications.comments}
            onChange={(event) => setNotificationPref('comments', event.currentTarget.checked)}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
