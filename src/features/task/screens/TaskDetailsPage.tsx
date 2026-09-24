import { useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
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
  Button,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconFolder,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';

import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import BackButton from '@/shared/ui/BackButton/BackButton';
import ActivityTimeline from '@/features/activity/components/ActivityTimeline';
import CommentSection from '@/features/comment/components/CommentSection';
import AttachmentSection from '@/features/attachment/components/AttachmentSection';
import EditTaskModal from '../components/EditTaskModal';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import { formatDate, formatDateTime } from '@/shared/utils/date';
import { useTask, useDeleteTask } from '../hooks/useTasks';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/features/auth/store/auth.store';

const STATUS_META: Record<string, { color: string; label: string }> = {
  Pending: { color: 'yellow', label: 'Pending' },
  'In Progress': { color: 'blue', label: 'In Progress' },
  Completed: { color: 'teal', label: 'Completed' },
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'teal',
  Medium: 'yellow',
  High: 'red',
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="sm" align="center">
      <Text size="xs" c="dimmed" fw={500}>
        {label}
      </Text>
      <div style={{ textAlign: 'right', minWidth: 0 }}>{children}</div>
    </Group>
  );
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [now] = useState(() => Date.now());
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  const { data: task, isLoading, isError } = useTask(taskId ?? '');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const [deleteOpened, setDeleteOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  if (!taskId) {
    return (
      <Navigate to={isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS} replace />
    );
  }

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading task details..." />;
  }

  if (isError || !task) {
    return (
      <CenteredState variant="error" message="Task could not be loaded." />
    );
  }

  const statusMeta = STATUS_META[task.status] ?? {
    color: 'gray',
    label: task.status,
  };
  const priorityColor = PRIORITY_COLORS[task.priority] ?? 'gray';
  const isCompleted = task.status === 'Completed';

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!due &&
    !isCompleted &&
    !Number.isNaN(due.getTime()) &&
    due.getTime() < now;

  const handleDelete = () => {
    deleteMutation.mutate(task.id, {
      onSuccess: () => {
        navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS);
      },
    });
    setDeleteOpened(false);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 animate-in">
      <BackButton
        label={isAdmin ? 'Back to Tasks' : 'Back to My Tasks'}
        onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
      />

      <Grid gap="lg" align="flex-start">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card
              withBorder
              radius="lg"
              p="xl"
              style={{
                backgroundColor: 'var(--app-surface)',
                border: '1px solid var(--app-border)',
                borderTop: `4px solid var(--mantine-color-${statusMeta.color}-6)`,
                boxShadow: 'var(--app-shadow-card)',
              }}
            >
              <Group gap="xs" mb="sm" wrap="wrap">
                <Badge color={statusMeta.color} variant="light" size="sm">
                  {statusMeta.label}
                </Badge>
                <Badge color={priorityColor} variant="outline" size="sm">
                  {task.priority} Priority
                </Badge>
              </Group>

              <Title order={2} fw={800} fz={24} lh={1.2}>
                {task.title}
              </Title>

              <Text
                mt="md"
                size="sm"
                c={task.description ? 'var(--app-text)' : 'dimmed'}
                style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
              >
                {task.description || 'No description provided for this task.'}
              </Text>

              <Divider my="lg" style={{ borderColor: 'var(--app-border)' }} />

              <Group gap="lg" wrap="wrap">
                {task.projectDetails && (
                  <Tooltip label={task.projectDetails.name} withArrow>
                    <Group gap={6} wrap="nowrap">
                      <IconFolder
                        size={15}
                        style={{ color: 'var(--app-accent)' }}
                      />
                      <Text size="xs" c="dimmed">
                        {task.projectDetails.name}
                      </Text>
                    </Group>
                  </Tooltip>
                )}
                {due && (
                  <Group gap={6} wrap="nowrap">
                    <IconCalendar
                      size={15}
                      style={{
                        color: isOverdue
                          ? 'var(--app-danger)'
                          : 'var(--app-text-muted)',
                      }}
                    />
                    <Text
                      size="xs"
                      c={isOverdue ? 'red' : 'dimmed'}
                      fw={isOverdue ? 700 : 500}
                    >
                      Due {formatDate(task.dueDate)}
                      {isOverdue && ' (Overdue)'}
                    </Text>
                  </Group>
                )}
              </Group>
            </Card>

            <AttachmentSection taskId={task.id} />

            <CommentSection taskId={task.id} />

            <ActivityTimeline taskId={task.id} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md" style={{ position: 'sticky', top: 80 }}>
            <Card
              withBorder
              radius="lg"
              p="md"
              style={{
                backgroundColor: 'var(--app-surface)',
                borderColor: 'var(--app-border)',
                boxShadow: 'var(--app-shadow-card)',
              }}
            >
              <Title order={5} fw={700} fz={14} mb="xs">
                Stage &amp; Status
              </Title>

              <SegmentedControl
                fullWidth
                orientation="vertical"
                value={task.status}
                disabled={isCompleted || isUpdating}
                onChange={(value) => {
                  if (!value || value === task.status) return;
                  updateStatus({
                    id: task.id,
                    status: value as 'Pending' | 'In Progress' | 'Completed',
                  });
                }}
                data={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'In Progress', value: 'In Progress' },
                  { label: 'Completed', value: 'Completed' },
                ]}
                radius="md"
                size="sm"
                styles={{
                  root: {
                    backgroundColor: 'var(--app-surface-2)',
                  },
                }}
              />

              {isCompleted && (
                <Text size="xs" c="dimmed" mt="xs" ta="center">
                  This task is completed.
                </Text>
              )}
            </Card>

            <Card
              withBorder
              radius="lg"
              p="md"
              style={{
                backgroundColor: 'var(--app-surface)',
                borderColor: 'var(--app-border)',
                boxShadow: 'var(--app-shadow-card)',
              }}
            >
              <Title order={5} fw={700} fz={14} mb="sm">
                Properties
              </Title>

              <Stack gap="xs">
                <DetailRow label="Assignee">
                  {task.assignedEmployee ? (
                    <Group gap={6} wrap="nowrap" justify="flex-end">
                      <Avatar size={22} radius="xl" color="indigo">
                        {task.assignedEmployee.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="xs" fw={600} lineClamp={1}>
                        {task.assignedEmployee.fullName}
                      </Text>
                    </Group>
                  ) : (
                    <Text size="xs" c="dimmed">
                      Unassigned
                    </Text>
                  )}
                </DetailRow>

                <DetailRow label="Project">
                  <Text size="xs" fw={600} lineClamp={1}>
                    {task.projectDetails?.name ?? 'No project'}
                  </Text>
                </DetailRow>

                <DetailRow label="Priority">
                  <Badge size="xs" variant="light" color={priorityColor}>
                    {task.priority}
                  </Badge>
                </DetailRow>

                <DetailRow label="Due Date">
                  <Text size="xs" fw={600} c={isOverdue ? 'red' : undefined}>
                    {task.dueDate ? formatDate(task.dueDate) : '—'}
                  </Text>
                </DetailRow>

                <Divider my={4} style={{ borderColor: 'var(--app-border)' }} />

                <DetailRow label="Created">
                  <Text size="xs" c="dimmed">
                    {task.createdAt ? formatDateTime(task.createdAt) : '—'}
                  </Text>
                </DetailRow>

                <DetailRow label="Updated">
                  <Text size="xs" c="dimmed">
                    {task.updatedAt ? formatDateTime(task.updatedAt) : '—'}
                  </Text>
                </DetailRow>
              </Stack>

              {isAdmin && (
                <>
                  <Divider
                    my="sm"
                    style={{ borderColor: 'var(--app-border)' }}
                  />
                  <Group gap="xs" grow>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<IconEdit size={14} />}
                      onClick={() => setEditOpened(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => setDeleteOpened(true)}
                    >
                      Delete
                    </Button>
                  </Group>
                </>
              )}
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <EditTaskModal
        opened={editOpened}
        task={task}
        onClose={() => setEditOpened(false)}
      />

      <ConfirmDeleteModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
