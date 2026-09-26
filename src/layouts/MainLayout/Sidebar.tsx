import { motion } from 'framer-motion';
import {
  Avatar,
  Box,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import {
  IconChartBar,
  IconChecklist,
  IconChevronRight,
  IconFolders,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconSettings,
  IconUsers,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconX,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ROUTES } from '@/shared/config/routes';
import logo from '@/assets/logo/logo.png';

interface SidebarProps {
  onNavigate?: () => void;
}

const navItemsAdmin = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: IconLayoutDashboard,
    key: 'dashboard',
  },
  {
    label: 'Projects',
    path: ROUTES.ADMIN_PROJECTS,
    icon: IconFolders,
    key: 'projects',
  },
  {
    label: 'Employees',
    path: ROUTES.EMPLOYEES,
    icon: IconUsers,
    key: 'employees',
  },
  {
    label: 'Tasks',
    path: ROUTES.ADMIN_TASKS,
    icon: IconChecklist,
    key: 'tasks',
  },
  {
    label: 'Board',
    path: ROUTES.ADMIN_BOARD,
    icon: IconLayoutKanban,
    key: 'board',
  },
  {
    label: 'Reports',
    path: ROUTES.ADMIN_REPORTS,
    icon: IconChartBar,
    key: 'reports',
  },
  {
    label: 'Settings',
    path: ROUTES.ADMIN_SETTINGS,
    icon: IconSettings,
    key: 'settings',
  },
] as const;

const navItemsEmployee = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: IconLayoutDashboard,
    key: 'dashboard',
  },
  {
    label: 'My Tasks',
    path: ROUTES.TASKS,
    icon: IconChecklist,
    key: 'tasks',
  },
  {
    label: 'My Board',
    path: ROUTES.BOARD,
    icon: IconLayoutKanban,
    key: 'board',
  },
  {
    label: 'My Projects',
    path: ROUTES.PROJECTS,
    icon: IconFolders,
    key: 'projects',
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: IconSettings,
    key: 'settings',
  },
] as const;

const NAV_ITEMS = {
  admin: navItemsAdmin,
  employee: navItemsEmployee,
} as const;

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

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

  const items = isAdmin ? NAV_ITEMS.admin : NAV_ITEMS.employee;

  const displayName = profile?.name ?? user?.fullName ?? 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 280 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--app-surface)',
        borderRight: '1px solid var(--app-border)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <Box
        p="md"
        style={{
          borderBottom: '1px solid var(--app-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Group
            gap="xs"
            wrap="nowrap"
            style={{ cursor: 'pointer' }}
            onClick={() => go(dashboardPath)}
          >
            <Avatar src={logo} radius="md" size={34} />
            <div>
              <Text fw={800} fz="sm" lh={1.1} c="var(--app-text)">
                SRYTAL
              </Text>
              <Text
                fz={10}
                c="dimmed"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: 0.5 }}
              >
                Task Cloud
              </Text>
            </div>
          </Group>
        )}

        <Tooltip
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          position="right"
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={toggleCollapsed}
            aria-label="Toggle sidebar"
            visibleFrom="md"
          >
            {collapsed ? (
              <IconLayoutSidebarLeftExpand size={18} />
            ) : (
              <IconLayoutSidebarLeftCollapse size={18} />
            )}
          </ActionIcon>
        </Tooltip>

        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={onNavigate}
          aria-label="Close navigation"
          hiddenFrom="md"
        >
          <IconX size={18} />
        </ActionIcon>
      </Box>

      <ScrollArea style={{ flex: 1 }} p={collapsed ? 'xs' : 'sm'}>
        {!collapsed && (
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            px="xs"
            mb="xs"
            style={{ letterSpacing: 0.8, fontSize: 10 }}
          >
            Workspace
          </Text>
        )}

        <Stack gap={4}>
          {items.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            const linkContent = (
              <NavLink
                active={active}
                label={collapsed ? null : item.label}
                leftSection={<Icon size={18} stroke={active ? 2.2 : 1.8} />}
                rightSection={
                  !collapsed && active ? (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: 'var(--app-primary)',
                        boxShadow: '0 0 8px var(--app-primary)',
                      }}
                    />
                  ) : null
                }
                onClick={() => go(item.path)}
                styles={{
                  root: {
                    borderRadius: 10,
                    padding: collapsed ? '10px 0' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    backgroundColor: active
                      ? 'var(--app-primary-light)'
                      : 'transparent',
                    color: active ? 'var(--app-primary)' : 'var(--app-text)',
                    transition: 'all 140ms ease-out',
                    '&:hover': {
                      backgroundColor: active
                        ? 'var(--app-primary-light)'
                        : 'var(--app-surface-hover)',
                      transform: 'translateX(2px)',
                    },
                  },
                  label: {
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    color: active ? 'var(--app-primary)' : 'var(--app-text)',
                  },
                  section: {
                    marginRight: collapsed ? 0 : 10,
                    color: active
                      ? 'var(--app-primary)'
                      : 'var(--app-text-muted)',
                  },
                }}
              />
            );

            if (collapsed) {
              return (
                <Tooltip
                  key={item.key}
                  label={item.label}
                  position="right"
                  withArrow
                >
                  <Box>{linkContent}</Box>
                </Tooltip>
              );
            }

            return <Box key={item.key}>{linkContent}</Box>;
          })}
        </Stack>
      </ScrollArea>

      <Box
        p="xs"
        style={{
          borderTop: '1px solid var(--app-border)',
          backgroundColor: 'var(--app-surface)',
        }}
      >
        <UnstyledButton
          onClick={() => go(settingsRoute)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 10,
            transition: 'background-color 150ms ease-out',
            backgroundColor: 'transparent',
          }}
          className="hover:bg-[var(--app-surface-hover)]"
        >
          <Group
            gap="xs"
            wrap="nowrap"
            justify={collapsed ? 'center' : 'flex-start'}
          >
            <Avatar
              src={profile?.avatar || undefined}
              radius="xl"
              size={32}
              color="indigo"
            >
              {initial}
            </Avatar>
            {!collapsed && (
              <>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="xs" fw={600} lineClamp={1} c="var(--app-text)">
                    {displayName}
                  </Text>
                  <Text size="10px" c="dimmed" lineClamp={1}>
                    {isAdmin ? 'Administrator' : 'Employee'}
                  </Text>
                </Box>
                <IconChevronRight
                  size={14}
                  style={{ color: 'var(--app-text-muted)' }}
                />
              </>
            )}
          </Group>
        </UnstyledButton>
      </Box>
    </motion.aside>
  );
}
