import {
  Avatar,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCalendar, IconFolder } from '@tabler/icons-react';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import BackButton from '@/shared/ui/BackButton/BackButton';
import ActivityTimeline from '@/features/activity/components/ActivityTimeline';
import CommentSection from '@/features/comment/components/CommentSection';
import { formatDate, formatDateTime } from '@/shared/utils/date';
import { useTask } from '../hooks/useTasks';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';

const statusColors: Record<string, string> = {
  Pending: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
};

const priorityColors: Record<string, string> = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="md" align="center">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <div style={{ textAlign: 'right', minWidth: 0 }}>{children}</div>
    </Group>
  );
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const [now] = useState(() => Date.now());

  const { data: task, isLoading, isError } = useTask(taskId ?? '');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();

  if (!taskId) {
    return <Navigate to="/admin/dashboard/tasks" replace />;
  }

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading task..." />;
  }

  if (isError || !task) {
    return <CenteredState variant="error" message="Task could not be loaded." />;
  }

  const statusColor = statusColors[task.status] ?? 'gray';
  const priorityColor = priorityColors[task.priority] ?? 'gray';
  const isCompleted = task.status === 'Completed';

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!due && !isCompleted && !Number.isNaN(due.getTime()) && due.getTime() < now;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <BackButton label="Back to Tasks" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card
              withBorder
              radius="lg"
              p="lg"
              style={{ borderTop: `3px solid var(--mantine-color-${statusColor}-6)` }}
            >
              <Group gap="xs" mb="sm">
                <Badge color={statusColor} variant="light">
                  {task.status}
                </Badge>
                <Badge color={priorityColor} variant="light">
                  {task.priority} priority
                </Badge>
              </Group>

              <Title order={2}>{task.title}</Title>

              <Text mt="sm" c={task.description ? undefined : 'dimmed'}>
                {task.description || 'No description provided.'}
              </Text>

              <Divider my="md" />

              <Group gap="lg" wrap="wrap">
                {task.projectDetails && (
                  <Group gap={6} wrap="nowrap">
                    <IconFolder size={15} style={{ color: 'var(--app-accent)' }} />
                    <Text size="sm" c="dimmed">
                      {task.projectDetails.name}
                    </Text>
                  </Group>
                )}
                {due && (
                  <Group gap={6} wrap="nowrap">
                    <IconCalendar
                      size={15}
                      style={{ color: isOverdue ? 'var(--app-danger)' : 'var(--app-text-muted)' }}
                    />
                    <Text size="sm" c={isOverdue ? 'red' : 'dimmed'} fw={isOverdue ? 600 : 400}>
                      Due {formatDate(task.dueDate)}
                      {isOverdue ? ' · Overdue' : ''}
                    </Text>
                  </Group>
                )}
              </Group>
            </Card>

            <ActivityTimeline taskId={task.id} />

            <CommentSection taskId={task.id} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Card withBorder radius="lg" p="lg">
              <Title order={5} mb="sm">
                Status
              </Title>

              <SegmentedControl
                fullWidth
                orientation="vertical"
                value={task.status}
                disabled={isCompleted || isUpdating}
                onChange={(value) => {
                  if (!value || value === task.status) {
                    return;
                  }
                  updateStatus({
                    id: task.id,
                    status: value as 'Pending' | 'In Progress' | 'Completed',
                  });
                }}
                data={['Pending', 'In Progress', 'Completed']}
              />

              {isCompleted && (
                <Text size="xs" c="dimmed" mt="sm">
                  This task is completed and locked.
                </Text>
              )}
            </Card>

            <Card withBorder radius="lg" p="lg">
              <Title order={5} mb="md">
                Details
              </Title>

              <Stack gap="md">
                <DetailRow label="Assignee">
                  {task.assignedEmployee ? (
                    <Group gap={8} wrap="nowrap" justify="flex-end">
                      <Avatar size={24} radius="xl" color="blue">
                        {task.assignedEmployee.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {task.assignedEmployee.fullName}
                      </Text>
                    </Group>
                  ) : (
                    <Text size="sm" c="dimmed">
                      Unassigned
                    </Text>
                  )}
                </DetailRow>

                <DetailRow label="Project">
                  <Text size="sm" fw={500} lineClamp={1}>
                    {task.projectDetails?.name ?? 'No project'}
                  </Text>
                </DetailRow>

                <DetailRow label="Priority">
                  <Badge size="sm" variant="light" color={priorityColor}>
                    {task.priority}
                  </Badge>
                </DetailRow>

                <DetailRow label="Due date">
                  <Text size="sm" fw={500} c={isOverdue ? 'red' : undefined}>
                    {task.dueDate ? formatDate(task.dueDate) : '—'}
                  </Text>
                </DetailRow>

                <Divider />

                <DetailRow label="Created">
                  <Text size="sm" c="dimmed">
                    {task.createdAt ? formatDateTime(task.createdAt) : '—'}
                  </Text>
                </DetailRow>

                <DetailRow label="Updated">
                  <Text size="sm" c="dimmed">
                    {task.updatedAt ? formatDateTime(task.updatedAt) : '—'}
                  </Text>
                </DetailRow>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}
