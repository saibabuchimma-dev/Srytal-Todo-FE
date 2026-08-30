import { Group, Paper, Text, Title } from '@mantine/core';
import { IconLayoutKanban } from '@tabler/icons-react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
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
    return <CenteredState variant="loading" label="Loading board..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="The task board could not be loaded." />;
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

          <Group gap="lg" wrap="wrap" align="center">
            {[
              { label: 'Pending', color: 'yellow', value: stats.pending },
              { label: 'In Progress', color: 'blue', value: stats.inProgress },
              { label: 'Completed', color: 'green', value: stats.completed },
            ].map((item) => (
              <Group key={item.label} gap={6} wrap="nowrap">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: `var(--mantine-color-${item.color}-6)`,
                    display: 'inline-block',
                  }}
                />
                <Text size="sm" c="dimmed">
                  {item.label}
                </Text>
                <Text size="sm" fw={700}>
                  {item.value}
                </Text>
              </Group>
            ))}

            <div
              className="rounded-full p-3"
              style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
            >
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
