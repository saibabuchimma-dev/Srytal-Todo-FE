import {
  Avatar,
  Box,
  Burger,
  Divider,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { logout as apiLogout } from '@/features/auth/services/auth.service';
import NotificationMenu from '@/features/notification/components/NotificationMenu';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ThemeToggle from '@/shared/ui/ThemeToggle/ThemeToggle';
import logo from '@/assets/logo/logo.png';
import { ROUTES } from '@/shared/config/routes';

interface HeaderProps {
  navOpened?: boolean;
  onNavToggle?: () => void;
}

function getPageTitle(pathname: string): string {
  const path = pathname.replace(/\/+$/, '');

  if (/\/employees\/[^/]+$/.test(path)) return 'Employee Details';
  if (/\/employees$/.test(path)) return 'Employees';
  if (/\/tasks\/[^/]+$/.test(path)) return 'Task Details';
  if (/\/tasks$/.test(path)) return 'Tasks';
  if (/\/projects\/[^/]+\/details$/.test(path)) return 'Project Details';
  if (/\/projects$/.test(path)) return 'Projects';
  if (/\/board$/.test(path)) return 'Board';
  if (/\/reports$/.test(path)) return 'Reports';
  if (/\/settings$/.test(path)) return 'Settings';
  return 'Dashboard';
}

export default function Header({ navOpened = false, onNavToggle }: HeaderProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'Admin';
  const settingsRoute = isAdmin ? ROUTES.ADMIN_SETTINGS : ROUTES.SETTINGS;
  const pageTitle = getPageTitle(location.pathname);
  const displayName = profile?.name ?? user?.fullName ?? 'User';
  const roleLabel = isAdmin ? 'Administrator' : 'Employee';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      void apiLogout(refreshToken);
    }
    logout();
    navigate(isAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN);
  };

  return (
    <Group justify="space-between" h="100%" px="lg" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={navOpened}
          onClick={onNavToggle}
          hiddenFrom="md"
          size="sm"
          aria-label="Toggle navigation"
        />
        <Avatar src={logo} radius="md" size={40} />
        <div>
          <Text fw={800} lh={1.05} fz="lg">
            Srytal
          </Text>
          <Text size="xs" c="dimmed" lh={1}>
            Task Management
          </Text>
        </div>

        <Divider orientation="vertical" mx="md" visibleFrom="md" />
        <Text fw={600} c="dimmed" visibleFrom="md">
          {pageTitle}
        </Text>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <ThemeToggle />

        <NotificationMenu />

        <Divider orientation="vertical" mx={4} visibleFrom="sm" />

        <Menu position="bottom-end" width={230} shadow="md" radius="md">
          <Menu.Target>
            <UnstyledButton
              style={{ padding: '6px 8px', borderRadius: 'var(--mantine-radius-md)' }}
              aria-label="Account menu"
            >
              <Group gap="xs" wrap="nowrap">
                <Avatar src={profile?.avatar || undefined} radius="xl" size={36} color="blue">
                  {initial}
                </Avatar>
                <Box visibleFrom="sm" style={{ minWidth: 0 }}>
                  <Text size="sm" fw={600} lh={1.1} lineClamp={1}>
                    {displayName}
                  </Text>
                  <Text size="xs" c="dimmed" lh={1.1}>
                    {roleLabel}
                  </Text>
                </Box>
                <IconChevronDown size={16} style={{ color: 'var(--app-text-muted)' }} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{displayName}</Menu.Label>
            <Menu.Item
              leftSection={<IconUserCircle size={16} />}
              onClick={() => void navigate(settingsRoute)}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSettings size={16} />}
              onClick={() => void navigate(settingsRoute)}
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
