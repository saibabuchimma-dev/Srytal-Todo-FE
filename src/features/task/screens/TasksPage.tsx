import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconCheckbox } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import Loader from '@/styles/loader';

export default function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { data: employees = [] } = useEmployees();
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');

  const visibleTasks = useMemo(() => {
    if (!isAdmin && activeTab === 'mine') {
      return tasks.filter((task) => task.assignedTo === user?.id);
    }

    return tasks;
  }, [activeTab, isAdmin, tasks, user?.id]);

  if (isLoading) {
    return <Loader label="Loading tasks" size={44} />;
  }

  if (isError) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
        Tasks could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper radius="lg" p="lg" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{isAdmin ? 'Task Management' : 'My Tasks'}</Title>
            <Text c="dimmed" mt="xs">
              {isAdmin
                ? 'Create, assign, and monitor work across your team.'
                : 'Keep track of the work assigned to you.'}
            </Text>
          </div>
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
            <IconCheckbox size={24} />
          </div>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder radius="lg" p="lg">
          <Title order={4}>Task Overview</Title>
          <Text c="dimmed" mt="xs">
            Total tasks: {tasks.length} • Assigned employees: {employees.length}
          </Text>
        </Card>
        <Card withBorder radius="lg" p="lg">
          <Group justify="space-between">
            <Title order={4}>Quick Status</Title>
            {isAdmin ? null : (
              <Button
                variant={activeTab === 'mine' ? 'filled' : 'light'}
                onClick={() => setActiveTab('mine')}
              >
                My Tasks
              </Button>
            )}
          </Group>
          <Stack gap="sm" mt="md">
            <Badge color="yellow">
              Pending: {tasks.filter((task) => task.status === 'Pending').length}
            </Badge>
            <Badge color="blue">
              In Progress: {tasks.filter((task) => task.status === 'In Progress').length}
            </Badge>
            <Badge color="green">
              Completed: {tasks.filter((task) => task.status === 'Completed').length}
            </Badge>
          </Stack>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="lg" p="lg">
        <TaskList tasks={visibleTasks} />
      </Card>
    </div>
  );
}
