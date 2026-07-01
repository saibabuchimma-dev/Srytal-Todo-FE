import { ActionIcon, Avatar, Group, Menu, Text, TextInput } from '@mantine/core';
import { IconBell, IconLogout, IconSearch, IconUserCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import logo from '@/assets/logo/logo.png';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Group justify="space-between" h="100%" px="md" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <Avatar src={logo} radius="md" size={42} />
        <div>
          <Text fw={800} lh={1.1}>
            Srytal
          </Text>
          <Text size="xs" c="dimmed">
            Task Management
          </Text>
        </div>
      </Group>

      <TextInput
        visibleFrom="sm"
        w={{ sm: 280, md: 360 }}
        placeholder="Search dashboard"
        leftSection={<IconSearch size={17} />}
      />

      <Group gap="sm" wrap="nowrap">
        <ActionIcon variant="light" color="indigo" radius="md" aria-label="Notifications">
          <IconBell size={18} />
        </ActionIcon>

        <Menu position="bottom-end" shadow="md" width={220}>
          <Menu.Target>
            <ActionIcon variant="subtle" size={42} radius="xl" aria-label="Admin profile">
              <Avatar radius="xl" color="blue">
                {user?.name?.charAt(0) ?? 'A'}
              </Avatar>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Profile</Menu.Label>
            <Menu.Item leftSection={<IconUserCircle size={16} />}>
              <div>
                <Text size="sm" fw={600}>
                  {user?.name ?? 'Administrator'}
                </Text>
                <Text size="xs" c="dimmed">
                  {user?.role ?? 'Admin'}
                </Text>
              </div>
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
