import { Card, Grid, Group, NavLink, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconLock, IconSettings, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import ProfileSettings from '../components/ProfileSettings';
import SecuritySettings from '../components/SecuritySettings';
import PreferencesSettings from '../components/PreferencesSettings';

type SectionKey = 'profile' | 'security' | 'preferences';

const sections: {
  key: SectionKey;
  label: string;
  description: string;
  icon: typeof IconUser;
  render: () => ReactNode;
}[] = [
  {
    key: 'profile',
    label: 'Profile',
    description: 'Your personal information',
    icon: IconUser,
    render: () => <ProfileSettings />,
  },
  {
    key: 'security',
    label: 'Security',
    description: 'Password & sign-in',
    icon: IconLock,
    render: () => <SecuritySettings />,
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description: 'Theme, notifications & locale',
    icon: IconSettings,
    render: () => <PreferencesSettings />,
  },
];

export default function SettingsPage() {
  const [activeKey, setActiveKey] = useState<SectionKey>('profile');
  const active = sections.find((section) => section.key === activeKey) ?? sections[0];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="light" size={48} radius="md">
            <IconSettings size={26} />
          </ThemeIcon>
          <div>
            <Title order={2}>Settings</Title>
            <Text c="dimmed">Manage your profile, security, and preferences.</Text>
          </div>
        </Group>
      </Paper>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Card withBorder radius="lg" p="xs">
            <Stack gap={4}>
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = section.key === activeKey;

                return (
                  <NavLink
                    key={section.key}
                    active={isActive}
                    variant="light"
                    label={section.label}
                    description={section.description}
                    leftSection={<Icon size={20} stroke={1.6} />}
                    onClick={() => setActiveKey(section.key)}
                    styles={{
                      root: { borderRadius: 'var(--mantine-radius-md)' },
                      label: { fontWeight: isActive ? 600 : 500 },
                    }}
                  />
                );
              })}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>{active.render()}</Grid.Col>
      </Grid>
    </div>
  );
}
