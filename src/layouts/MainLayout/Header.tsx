import { motion } from 'framer-motion';
import {
  Avatar,
  Box,
  Burger,
  Divider,
  Group,
  Menu,
  Text,
  UnstyledButton,
  Tooltip,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCircle,
  IconChevronRight,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { logout as apiLogout } from '@/features/auth/services/auth.service';
import NotificationMenu from '@/features/notification/components/NotificationMenu';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ThemeToggle from '@/shared/ui/ThemeToggle/ThemeToggle';
import { ROUTES } from '@/shared/config/routes';

interface HeaderProps {
  navOpened?: boolean;
  onNavToggle?: () => void;
}

function getPageTitle(pathname: string): { section: string; title: string } {
  const path = pathname.replace(/\/+$/, '');

  if (/\/employees\/[^/]+$/.test(path))
    return { section: 'Team', title: 'Employee Details' };
  if (/\/employees$/.test(path)) return { section: 'Team', title: 'Employees' };
  if (/\/tasks\/[^/]+$/.test(path))
    return { section: 'Tasks', title: 'Task Details' };
  if (/\/tasks$/.test(path)) return { section: 'Tasks', title: 'Task List' };
  if (/\/projects\/[^/]+\/details$/.test(path))
    return { section: 'Projects', title: 'Project Details' };
  if (/\/projects$/.test(path))
    return { section: 'Projects', title: 'Project Overview' };
  if (/\/board$/.test(path)) return { section: 'Tasks', title: 'Kanban Board' };
  if (/\/reports$/.test(path))
    return { section: 'Analytics', title: 'Reports & Insights' };
  if (/\/settings$/.test(path))
    return { section: 'Preferences', title: 'Settings' };
  return { section: 'Overview', title: 'Dashboard' };
}

export default function Header({
  navOpened = false,
  onNavToggle,
}: HeaderProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'Admin';
  const settingsRoute = isAdmin ? ROUTES.ADMIN_SETTINGS : ROUTES.SETTINGS;
  const { section, title } = getPageTitle(location.pathname);
  const displayName = profile?.name ?? user?.fullName ?? 'User';
  const roleLabel = isAdmin ? 'Admin' : 'Employee';
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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        height: 64,
        backgroundColor: 'var(--app-glass-bg)',
        borderBottom: '1px solid var(--app-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group justify="space-between" h="100%" px="lg" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Burger
            opened={navOpened}
            onClick={onNavToggle}
            hiddenFrom="md"
            size="sm"
            aria-label="Toggle navigation"
          />

          <Group gap={6} wrap="nowrap">
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: 0.5 }}
            >
              {section}
            </Text>
            <IconChevronRight
              size={12}
              style={{ color: 'var(--app-text-muted)' }}
            />
            <Text size="sm" fw={700} c="var(--app-text)">
              {title}
            </Text>
          </Group>
        </Group>

        <Group gap="sm" wrap="nowrap">
          <ThemeToggle />

          <NotificationMenu />

          <Divider
            orientation="vertical"
            mx={2}
            style={{ borderColor: 'var(--app-border)' }}
          />

          <Menu position="bottom-end" width={220} shadow="md" radius="md">
            <Menu.Target>
              <Tooltip label="Account settings" withArrow>
                <UnstyledButton
                  style={{
                    padding: '4px 6px',
                    borderRadius: 10,
                    transition: 'background-color 150ms ease-out',
                  }}
                  className="hover:bg-[var(--app-surface-hover)]"
                  aria-label="Account menu"
                >
                  <Group gap="xs" wrap="nowrap">
                    <Avatar
                      src={profile?.avatar || undefined}
                      radius="xl"
                      size={32}
                      color="indigo"
                      style={{ border: '2px solid var(--app-border)' }}
                    >
                      {initial}
                    </Avatar>
                    <Box
                      visibleFrom="sm"
                      style={{ minWidth: 0, maxWidth: 120 }}
                    >
                      <Text
                        size="xs"
                        fw={600}
                        lh={1.1}
                        lineClamp={1}
                        c="var(--app-text)"
                      >
                        {displayName}
                      </Text>
                      <Text size="10px" c="dimmed" lh={1.1}>
                        {roleLabel}
                      </Text>
                    </Box>
                    <IconChevronDown
                      size={14}
                      style={{ color: 'var(--app-text-muted)' }}
                    />
                  </Group>
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown p={4}>
              <Box
                px="sm"
                py="xs"
                style={{ borderBottom: '1px solid var(--app-border)' }}
              >
                <Text fw={600} size="xs" lineClamp={1}>
                  {displayName}
                </Text>
                <Text size="10px" c="dimmed" lineClamp={1}>
                  {user?.email ?? ''}
                </Text>
              </Box>

              <Menu.Item
                leftSection={<IconUserCircle size={15} />}
                onClick={() => void navigate(settingsRoute)}
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                Profile &amp; Account
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={15} />}
                onClick={() => void navigate(settingsRoute)}
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                Settings
              </Menu.Item>

              <Menu.Divider my={4} />

              <Menu.Item
                color="red"
                leftSection={<IconLogout size={15} />}
                onClick={handleLogout}
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </motion.header>
  );
}
