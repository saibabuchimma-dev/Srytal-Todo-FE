import { Alert, Badge, Group, Paper, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconLayoutKanban } from '@tabler/icons-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import Loader from '@/styles/loader';
import KanbanBoard from '../components/KanbanBoard';
import { useMyTasks, useTasks } from '../hooks/useTasks';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';
import { getTaskStats } from '../utils/task.utils';
import type { TaskStatus } from '../types/task';

export default function TaskBoardPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const adminTasks = useTasks({ enabled: isAdmin });
  const myTasks = useMyTasks({ enabled: !isAdmin });

  const { data: tasks = [], isLoading, isError } = isAdmin ? adminTasks : myTasks;

  const updateStatus = useUpdateTaskStatus();
  const updatingTaskId = updateStatus.isPending ? (updateStatus.variables?.id ?? null) : null;

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateStatus.mutate({ id: taskId, status });
  };

  if (isLoading) {
    return <Loader label="Loading board..." size={44} />;
  }

  if (isError) {
    return (
      <Alert radius="md" color="red" icon={<IconAlertCircle size={18} />}>
        The task board could not be loaded.
      </Alert>
    );
  }

  const stats = getTaskStats(tasks);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{isAdmin ? 'Task Board' : 'My Board'}</Title>
            <Text c="dimmed">Drag a task between columns to update its status.</Text>
          </div>

          <Group gap="xs">
            <Badge color="gray" variant="light" size="lg">
              Pending {stats.pending}
            </Badge>
            <Badge color="blue" variant="light" size="lg">
              In Progress {stats.inProgress}
            </Badge>
            <Badge color="green" variant="light" size="lg">
              Completed {stats.completed}
            </Badge>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <IconLayoutKanban size={24} />
            </div>
          </Group>
        </Group>
      </Paper>

      <KanbanBoard
        tasks={tasks}
        updatingTaskId={updatingTaskId}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
