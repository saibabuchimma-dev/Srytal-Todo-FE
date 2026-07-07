import { Alert, Badge, Card, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Navigate, useParams } from 'react-router-dom';
import Loader from '@/styles/loader';
import { useTask } from '../hooks/useTasks';

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const { data: task, isLoading, isError } = useTask(taskId ?? '');

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
        <Group justify="space-between">
          <div>
            <Title order={2}>{task.title}</Title>
            <Text mt={5} c="dimmed">
              {task.description}
            </Text>
          </div>

          <Group>
            <Badge color="blue">{task.status}</Badge>
            <Badge color="orange">{task.priority}</Badge>
          </Group>
        </Group>
      </Card>

      <Grid>
        <Grid.Col span={6}>
          <Card withBorder radius="md">
            <Stack>
              <Title order={4}>Task Information</Title>
              <Group justify="space-between">
                <Text fw={600}>Assigned To</Text>
                <Text>{task.assignedEmployee?.fullName ?? 'Not Assigned'}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={600}>Status</Text>
                <Badge>{task.status}</Badge>
              </Group>
              <Group justify="space-between">
                <Text fw={600}>Priority</Text>
                <Badge color="orange">{task.priority}</Badge>
              </Group>
              <Group justify="space-between">
                <Text fw={600}>Due Date</Text>
                <Text>{task.dueDate}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card withBorder radius="md">
            <Stack>
              <Title order={4}>Timeline</Title>
              <Group justify="space-between">
                <Text fw={600}>Created At</Text>
                <Text>{task.createdAt ?? '-'}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={600}>Updated At</Text>
                <Text>{task.updatedAt ?? '-'}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
