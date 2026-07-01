import { ActionIcon, Badge, Group, Menu, Stack, Text } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationTone } from '../types/notification';

const toneColors: Record<NotificationTone, string> = {
  info: 'blue',
  warning: 'yellow',
  success: 'green',
};

export default function NotificationMenu() {
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Menu position="bottom-end" shadow="md" width={340}>
      <Menu.Target>
        <ActionIcon variant="light" color="indigo" radius="md" aria-label="Notifications">
          <IconBell size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between">
            <Text size="xs" fw={700}>
              Notifications
            </Text>
            {unreadCount > 0 ? (
              <Badge size="xs" color="indigo">
                {unreadCount} new
              </Badge>
            ) : null}
          </Group>
        </Menu.Label>

        {notifications.length === 0 ? (
          <Menu.Item>
            <Text size="sm" c="dimmed">
              No notifications yet.
            </Text>
          </Menu.Item>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <Menu.Item key={notification.id}>
              <Stack gap={4}>
                <Group justify="space-between" wrap="nowrap">
                  <Text size="sm" fw={700} lineClamp={1}>
                    {notification.title}
                  </Text>
                  <Badge size="xs" color={toneColors[notification.tone]} variant="light">
                    {notification.tone}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {notification.message}
                </Text>
                <Text size="xs" c="dimmed">
                  {dayjs(notification.createdAt).format('DD MMM YYYY, h:mm A')}
                </Text>
              </Stack>
            </Menu.Item>
          ))
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
