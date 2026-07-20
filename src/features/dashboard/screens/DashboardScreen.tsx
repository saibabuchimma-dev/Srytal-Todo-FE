import { Badge, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useMyTasks, useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';
import { ROUTES } from '@/shared/config/routes';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';
  const employeesQuery = useEmployees({
    enabled: isAdmin,
  });

  const adminTasksQuery = useTasks({
    enabled: isAdmin,
  });

  const myTasksQuery = useMyTasks({
    enabled: !isAdmin,
  });

  const employees = employeesQuery.data ?? [];
  const tasks = isAdmin ? (adminTasksQuery.data ?? []) : (myTasksQuery.data ?? []);

  const stats = getTaskStats(tasks);

  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== 'Completed')
    .sort((currentTask, nextTask) => Date.parse(currentTask.dueDate) - Date.parse(nextTask.dueDate))
    .slice(0, 4);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper radius="lg" p="lg" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Badge color={isAdmin ? 'indigo' : 'teal'}>
              {isAdmin ? 'Admin Portal' : 'Employee Portal'}
            </Badge>
            <Title order={2} mt="sm">
              Welcome back, {user?.fullName ?? 'there'}
            </Title>
            <Text c="dimmed" mt="xs">
              {isAdmin
                ? 'Manage people, work, and progress from a single enterprise dashboard.'
                : 'Review your assigned work and keep your tasks moving forward.'}
            </Text>
          </div>

          <Group>
            {isAdmin ? (
              <>
                <Button variant="light" onClick={() => navigate(ROUTES.PROJECTS)}>
                  View Projects
                </Button>
                <Button onClick={() => navigate(ROUTES.PROFILE)}>Open Profile</Button>
              </>
            ) : (
              <>
                <Button variant="light" onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}>
                  Change Password
                </Button>
                <Button onClick={() => navigate(ROUTES.PROFILE)}>View Profile</Button>
              </>
            )}
          </Group>
        </Group>
      </Paper>

      <DashboardStats />

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder radius="lg" p="lg">
          <Title order={4}>At a glance</Title>
          <Stack gap="sm" mt="md">
            <Text>
              {isAdmin
                ? `You currently have ${employees.length} employees and ${stats.total} tasks in the system.`
                : `You have ${stats.total} assigned tasks with ${stats.pending} pending and ${stats.inProgress} in progress.`}
            </Text>
            {isAdmin ? (
              <Text c="dimmed">
                Active employees:{' '}
                {employees.filter((employee) => employee.isActive !== false).length}
              </Text>
            ) : (
              <Text c="dimmed">
                Completed tasks: {stats.completed} • Pending: {stats.pending}
              </Text>
            )}
          </Stack>
        </Card>

        <Card withBorder radius="lg" p="lg">
          <Title order={4}>Upcoming work</Title>
          <Stack gap="sm" mt="md">
            {upcomingTasks.length === 0 ? (
              <Text c="dimmed">No upcoming tasks for now.</Text>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="rounded-md border border-slate-200 p-3">
                  <Group justify="space-between">
                    <Text fw={600}>{task.title}</Text>
                    <Badge color={task.status === 'Completed' ? 'green' : 'yellow'}>
                      {task.status}
                    </Badge>
                  </Group>
                  <Text c="dimmed" size="sm" mt={4}>
                    Due {task.dueDate || 'TBD'}
                  </Text>
                </div>
              ))
            )}
          </Stack>
        </Card>
      </SimpleGrid>
    </div>
  );
}
