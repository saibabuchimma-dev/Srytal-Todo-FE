import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Indicator,
  Menu,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBell,
  IconBellOff,
  IconChecks,
  IconMessageCircle,
  IconProgress,
  IconUserPlus,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { fromNow, formatDateTime } from '@/shared/utils/date';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePreferencesStore } from '@/shared/store/preferences.store';
import { ROUTES } from '@/shared/config/routes';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import type { AppNotification, NotificationType } from '../types/notification';

const PREF_BY_TYPE: Record<NotificationType, 'taskAssigned' | 'statusChanges' | 'comments'> = {
  TASK_ASSIGNED: 'taskAssigned',
  TASK_STATUS: 'statusChanges',
  COMMENT_ADDED: 'comments',
};

const TYPE_CONFIG: Record<NotificationType, { icon: typeof IconBell; color: string }> = {
  TASK_ASSIGNED: { icon: IconUserPlus, color: 'blue' },
  TASK_STATUS: { icon: IconProgress, color: 'grape' },
  COMMENT_ADDED: { icon: IconMessageCircle, color: 'teal' },
};

export default function NotificationMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const preferences = usePreferencesStore((state) => state.notifications);

  const { data: allNotifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = allNotifications.filter(
    (notification) => preferences[PREF_BY_TYPE[notification.type]] !== false,
  );

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }

    if (notification.taskId) {
      const route =
        user?.role === 'Admin'
          ? ROUTES.ADMIN_TASK_DETAILS(notification.taskId)
          : ROUTES.TASK_DETAILS(notification.taskId);
      void navigate(route);
    }
  };

  return (
    <Menu position="bottom-end" shadow="md" width={360} radius="md">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size={40}
          radius="xl"
          aria-label="Notifications"
        >
          <Indicator
            disabled={unreadCount === 0}
            label={unreadCount > 9 ? '9+' : unreadCount}
            size={16}
            color="red"
            offset={4}
          >
            <IconBell size={20} />
          </Indicator>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Group justify="space-between" px="md" py="sm" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Text fw={700}>Notifications</Text>
            {unreadCount > 0 && (
              <ThemeIcon size={20} radius="xl" color="red" variant="filled">
                <Text size="10px" fw={700}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </ThemeIcon>
            )}
          </Group>

          {unreadCount > 0 && (
            <Tooltip label="Mark all as read" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="Mark all as read"
                onClick={() => markAll.mutate()}
              >
                <IconChecks size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        <Divider />

        {notifications.length === 0 ? (
          <Stack align="center" gap="xs" py={40} px="md">
            <ThemeIcon size={48} radius="xl" variant="light" color="gray">
              <IconBellOff size={24} />
            </ThemeIcon>
            <Text size="sm" c="dimmed" ta="center">
              You're all caught up.
            </Text>
          </Stack>
        ) : (
          <ScrollArea.Autosize mah={400} type="hover">
            <Box py={4}>
              {notifications.slice(0, 12).map((notification) => {
                const config = TYPE_CONFIG[notification.type];
                const Icon = config.icon;

                return (
                  <Menu.Item
                    key={notification.id}
                    onClick={() => handleClick(notification)}
                    style={{
                      borderRadius: 0,
                      background: notification.isRead ? undefined : 'var(--app-accent-soft)',
                    }}
                  >
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <ThemeIcon size={34} radius="xl" variant="light" color={config.color}>
                        <Icon size={18} />
                      </ThemeIcon>

                      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                        <Text size="sm" fw={notification.isRead ? 400 : 600} lineClamp={2}>
                          {notification.message}
                        </Text>
                        {notification.createdAt && (
                          <Text size="xs" c="dimmed" title={formatDateTime(notification.createdAt)}>
                            {fromNow(notification.createdAt)}
                          </Text>
                        )}
                      </Stack>

                      {!notification.isRead && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            marginTop: 6,
                            flexShrink: 0,
                            background: 'var(--app-primary)',
                          }}
                        />
                      )}
                    </Group>
                  </Menu.Item>
                );
              })}
            </Box>
          </ScrollArea.Autosize>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
