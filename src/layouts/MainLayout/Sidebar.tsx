import { Button, Card, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/config/routes';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const items = isAdmin
    ? [
        { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
        { label: 'Projects', path: ROUTES.ADMIN_PROJECTS },
        { label: 'Employees', path: ROUTES.EMPLOYEES },
        { label: 'Tasks', path: ROUTES.ADMIN_TASKS },
        { label: 'Profile', path: ROUTES.ADMIN_PROFILE },
      ]
    : [
        { label: 'Dashboard', path: ROUTES.DASHBOARD },
        { label: 'My Tasks', path: ROUTES.TASKS },
        { label: 'My Projects', path: ROUTES.PROJECTS },
        { label: 'Profile', path: ROUTES.PROFILE },
        { label: 'Change Password', path: ROUTES.CHANGE_PASSWORD },
      ];

  return (
    <ScrollArea className="h-full bg-slate-50">
      <div className="p-4">
        <Card withBorder radius="md" p="md" mb="md">
          <Title order={4}>Workspace</Title>
          <Text c="dimmed" size="sm" mt="xs">
            {isAdmin ? 'Administrative overview' : 'Personal task workspace'}
          </Text>
        </Card>

        <Stack gap="xs">
          {items.map((item) => (
            <Button
              key={item.path}
              variant="subtle"
              justify="flex-start"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Card withBorder radius="md" p="md" mt="md">
          <Group justify="space-between" align="center">
            <Text fw={600}>Portal</Text>
            <Text size="sm" c="blue">
              {isAdmin ? 'Admin' : 'Employee'}
            </Text>
          </Group>
          <Text c="dimmed" size="sm" mt="xs">
            {isAdmin
              ? 'Manage employees, tasks, and projects from one place.'
              : 'Track your assigned work and keep your profile up to date.'}
          </Text>
        </Card>
      </div>
    </ScrollArea>
  );
}
