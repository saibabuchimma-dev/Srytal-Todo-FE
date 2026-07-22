import { Alert, Badge, Card, Grid, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Navigate, useParams } from 'react-router-dom';

import Loader from '@/styles/loader';
import CommentSection from '@/features/comment/components/CommentSection';
import { useTask } from '../hooks/useTasks';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';

const statusColors = {
  Pending: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
} as const;

const priorityColors = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
} as const;

export default function TaskDetailsPage() {
  const { taskId } = useParams();

  const { data: task, isLoading, isError } = useTask(taskId ?? '');

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();

  if (!taskId) {
    return <Navigate to="/admin/dashboard/tasks" replace />;
  }

  if (isLoading) {
    return <Loader label="Loading task..." size={44} />;
  }

  if (isError || !task) {
    return (
      <Alert color="red" radius="md" icon={<IconAlertCircle size={18} />}>
        Task could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card withBorder radius="lg" p="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{task.title}</Title>

            <Text mt={6} c="dimmed">
              {task.description}
            </Text>
          </div>

          <Group>
            <Badge color={statusColors[task.status]}>{task.status}</Badge>

            <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
          </Group>
        </Group>
      </Card>

      <Grid>
        <Grid.Col span={6}>
          <Card withBorder radius="md">
            <Stack gap="md">
              <Title order={4}>Task Information</Title>

              <Group justify="space-between">
                <Text fw={600}>Assigned To</Text>
                <Text>{task.assignedEmployee?.fullName ?? 'Not Assigned'}</Text>
              </Group>

              <Group justify="space-between">
                <Text fw={600}>Project</Text>
                <Text>{task.projectDetails?.name ?? 'No Project'}</Text>
              </Group>

              <Group justify="space-between">
                <Text fw={600}>Status</Text>

                <Badge color={statusColors[task.status]}>{task.status}</Badge>
              </Group>

              <Group justify="space-between">
                <Text fw={600}>Priority</Text>

                <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
              </Group>

              <Group justify="space-between">
                <Text fw={600}>Due Date</Text>

                <Text>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card withBorder radius="md">
            <Stack gap="md">
              <Title order={4}>Timeline</Title>

              <Group justify="space-between">
                <Text fw={600}>Created At</Text>

                <Text>{task.createdAt ? new Date(task.createdAt).toLocaleString() : '-'}</Text>
              </Group>

              <Group justify="space-between">
                <Text fw={600}>Updated At</Text>

                <Text>{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : '-'}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder radius="md" p="md">
        <Stack>
          <Title order={5}>Update Task Status</Title>

          <Select
            label="Status"
            data={['Pending', 'In Progress', 'Completed']}
            value={task.status}
            disabled={task.status === 'Completed' || isUpdating}
            onChange={(value) => {
              if (!value || value === task.status) {
                return;
              }

              updateStatus({
                id: task.id,
                status: value as 'Pending' | 'In Progress' | 'Completed',
              });
            }}
          />
        </Stack>
      </Card>

      <CommentSection taskId={task.id} />
    </div>
  );
}
