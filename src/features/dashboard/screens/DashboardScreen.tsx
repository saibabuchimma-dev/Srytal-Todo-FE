import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconCalendarEvent,
  IconChecklist,
  IconFolders,
  IconLayoutKanban,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import DashboardStats from '../components/DashboardStats';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useMyTasks, useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';
import { formatDate } from '@/shared/utils/date';
import { ROUTES } from '@/shared/config/routes';
import type { Task } from '@/features/task/types/task';

const STATUS_META: Record<string, { color: string; label: string }> = {
  Pending: { color: 'yellow', label: 'Pending' },
  'In Progress': { color: 'blue', label: 'In Progress' },
  Completed: { color: 'green', label: 'Completed' },
};

const priorityColors: Record<string, string> = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const adminTasksQuery = useTasks({ enabled: isAdmin });
  const myTasksQuery = useMyTasks({ enabled: !isAdmin });

  const isLoading = isAdmin ? adminTasksQuery.isLoading : myTasksQuery.isLoading;
  const tasks: Task[] = isAdmin ? (adminTasksQuery.data ?? []) : (myTasksQuery.data ?? []);

  const stats = getTaskStats(tasks);
  const completion = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const pct = (count: number) => (stats.total ? Math.round((count / stats.total) * 100) : 0);

  const statusRows = [
    { key: 'Pending', count: stats.pending },
    { key: 'In Progress', count: stats.inProgress },
    { key: 'Completed', count: stats.completed },
  ];

  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== 'Completed' && task.dueDate)
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
    .slice(0, 5);

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading your dashboard..." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper radius="lg" p="xl" withBorder>
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div>
            <Badge variant="light" color={isAdmin ? 'indigo' : 'teal'} radius="sm">
              {isAdmin ? 'Admin Portal' : 'Employee Portal'}
            </Badge>
            <Title order={2} mt="sm">
              Welcome back, {user?.fullName ?? 'there'}
            </Title>
            <Text c="dimmed" mt={4}>
              {isAdmin
                ? 'Track people, work, and progress across your workspace.'
                : 'Here is what needs your attention today.'}
            </Text>
          </div>

          <Group>
            {isAdmin ? (
              <>
                <Button
                  variant="light"
                  leftSection={<IconUsers size={16} />}
                  onClick={() => navigate(ROUTES.EMPLOYEES)}
                >
                  Employees
                </Button>
                <Button
                  leftSection={<IconFolders size={16} />}
                  onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}
                >
                  Projects
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="light"
                  leftSection={<IconLayoutKanban size={16} />}
                  onClick={() => navigate(ROUTES.BOARD)}
                >
                  My Board
                </Button>
                <Button
                  leftSection={<IconChecklist size={16} />}
                  onClick={() => navigate(ROUTES.TASKS)}
                >
                  My Tasks
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Paper>

      <DashboardStats />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="lg" p="lg">
          <Title order={4}>Task Overview</Title>
          <Group mt="lg" align="center" gap="xl" wrap="nowrap">
            <RingProgress
              size={150}
              thickness={14}
              roundCaps
              sections={statusRows.map((row) => ({
                value: pct(row.count),
                color: STATUS_META[row.key].color,
                tooltip: `${STATUS_META[row.key].label}: ${row.count}`,
              }))}
              label={
                <div style={{ textAlign: 'center' }}>
                  <Text fz={26} fw={800} lh={1}>
                    {completion}%
                  </Text>
                  <Text fz="xs" c="dimmed">
                    Completed
                  </Text>
                </div>
              }
            />

            <Stack gap="sm" style={{ flex: 1 }}>
              {statusRows.map((row) => (
                <Group key={row.key} justify="space-between" wrap="nowrap">
                  <Group gap="xs" wrap="nowrap">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: `var(--mantine-color-${STATUS_META[row.key].color}-6)`,
                        display: 'inline-block',
                      }}
                    />
                    <Text size="sm">{STATUS_META[row.key].label}</Text>
                  </Group>
                  <Group gap={6} wrap="nowrap">
                    <Text size="sm" fw={700}>
                      {row.count}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ({pct(row.count)}%)
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="lg" p="lg">
          <Group justify="space-between" align="center">
            <Title order={4}>Upcoming work</Title>
            <Badge variant="light" color="gray" leftSection={<IconCalendarEvent size={12} />}>
              {upcomingTasks.length}
            </Badge>
          </Group>

          {upcomingTasks.length === 0 ? (
            <CenteredState
              variant="empty"
              message="Nothing due right now. You're all caught up."
              minHeight={180}
            />
          ) : (
            <Stack gap="xs" mt="md">
              {upcomingTasks.map((task) => (
                <Group
                  key={task.id}
                  justify="space-between"
                  wrap="nowrap"
                  p="sm"
                  style={{
                    border: '1px solid var(--app-border)',
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Text size="sm" fw={600} lineClamp={1}>
                      {task.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Due {formatDate(task.dueDate)}
                    </Text>
                  </div>
                  <Group gap="xs" wrap="nowrap">
                    <Badge size="sm" variant="light" color={priorityColors[task.priority] ?? 'gray'}>
                      {task.priority}
                    </Badge>
                    <Badge size="sm" variant="light" color={STATUS_META[task.status]?.color ?? 'gray'}>
                      {task.status}
                    </Badge>
                  </Group>
                </Group>
              ))}

              <Button
                variant="subtle"
                rightSection={<IconArrowRight size={16} />}
                mt="xs"
                onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
              >
                View all tasks
              </Button>
            </Stack>
          )}
        </Card>
      </SimpleGrid>
    </div>
  );
}
