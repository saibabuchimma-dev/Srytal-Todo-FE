import { ActionIcon, Group, Indicator, Menu, Stack, Text } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/config/routes';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import type { AppNotification } from '../types/notification';

export default function NotificationMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

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
    <Menu position="bottom-end" shadow="md" width={340}>
      <Menu.Target>
        <ActionIcon variant="light" color="indigo" radius="md" aria-label="Notifications">
          <Indicator
            disabled={unreadCount === 0}
            label={unreadCount > 9 ? '9+' : unreadCount}
            size={16}
            color="red"
            offset={2}
          >
            <IconBell size={18} />
          </Indicator>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between">
            <Text size="xs" fw={700}>
              Notifications
            </Text>

            {unreadCount > 0 && (
              <Text
                size="xs"
                c="indigo"
                fw={600}
                style={{ cursor: 'pointer' }}
                onClick={() => markAll.mutate()}
              >
                Mark all read
              </Text>
            )}
          </Group>
        </Menu.Label>

        {notifications.length === 0 ? (
          <Menu.Item disabled>
            <Text size="sm" c="dimmed">
              No notifications yet.
            </Text>
          </Menu.Item>
        ) : (
          notifications.slice(0, 8).map((notification) => (
            <Menu.Item key={notification.id} onClick={() => handleClick(notification)}>
              <Group gap="xs" wrap="nowrap" align="flex-start">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    marginTop: 6,
                    flexShrink: 0,
                    background: notification.isRead
                      ? 'transparent'
                      : 'var(--mantine-color-indigo-6)',
                  }}
                />

                <Stack gap={2} style={{ flex: 1 }}>
                  <Text size="sm" fw={notification.isRead ? 400 : 600} lineClamp={2}>
                    {notification.message}
                  </Text>

                  {notification.createdAt && (
                    <Text size="xs" c="dimmed">
                      {dayjs(notification.createdAt).format('DD MMM, HH:mm')}
                    </Text>
                  )}
                </Stack>
              </Group>
            </Menu.Item>
          ))
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
