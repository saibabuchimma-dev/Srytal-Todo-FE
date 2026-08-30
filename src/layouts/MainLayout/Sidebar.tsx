import { Avatar, Box, Group, NavLink, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconChartBar,
  IconChecklist,
  IconChevronRight,
  IconFolders,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ROUTES } from '@/shared/config/routes';

interface SidebarProps {
  /** Called after a nav item is chosen — used to close the mobile slide-over. */
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const isAdmin = user?.role === 'Admin';
  const settingsRoute = isAdmin ? ROUTES.ADMIN_SETTINGS : ROUTES.SETTINGS;

  const dashboardPath = isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
  const current = location.pathname.replace(/\/+$/, '');

  const isActive = (path: string) => {
    const target = path.replace(/\/+$/, '');
    if (target === dashboardPath.replace(/\/+$/, '')) {
      return current === target;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  const items = isAdmin
    ? [
        { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: IconLayoutDashboard },
        { label: 'Projects', path: ROUTES.ADMIN_PROJECTS, icon: IconFolders },
        { label: 'Employees', path: ROUTES.EMPLOYEES, icon: IconUsers },
        { label: 'Tasks', path: ROUTES.ADMIN_TASKS, icon: IconChecklist },
        { label: 'Board', path: ROUTES.ADMIN_BOARD, icon: IconLayoutKanban },
        { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: IconChartBar },
        { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: IconSettings },
      ]
    : [
        { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: IconLayoutDashboard },
        { label: 'My Tasks', path: ROUTES.TASKS, icon: IconChecklist },
        { label: 'My Board', path: ROUTES.BOARD, icon: IconLayoutKanban },
        { label: 'My Projects', path: ROUTES.PROJECTS, icon: IconFolders },
        { label: 'Settings', path: ROUTES.SETTINGS, icon: IconSettings },
      ];

  const displayName = profile?.name ?? user?.fullName ?? 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--app-surface)',
      }}
    >
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap={4} p="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            px="xs"
            mb={4}
            style={{ letterSpacing: 0.6 }}
          >
            Menu
          </Text>

          {items.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                active={active}
                variant="light"
                label={item.label}
                leftSection={<Icon size={20} stroke={1.6} />}
                onClick={() => go(item.path)}
                styles={{
                  root: { borderRadius: 'var(--mantine-radius-md)', paddingBlock: 10 },
                  label: { fontWeight: active ? 600 : 500, fontSize: 14 },
                }}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      <UnstyledButton
        onClick={() => go(settingsRoute)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderTop: '1px solid var(--app-border)',
        }}
      >
        <Group gap="sm" wrap="nowrap">
          <Avatar src={profile?.avatar || undefined} radius="xl" size={40} color="blue">
            {initial}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={600} lineClamp={1}>
              {displayName}
            </Text>
            <Text size="xs" c="dimmed">
              {isAdmin ? 'Administrator' : 'Employee'}
            </Text>
          </div>
          <IconChevronRight size={16} style={{ color: 'var(--app-text-muted)' }} />
        </Group>
      </UnstyledButton>
    </Box>
  );
}
