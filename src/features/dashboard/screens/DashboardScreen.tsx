import { motion } from 'framer-motion';
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
  Tooltip,
  Box,
} from '@mantine/core';
import {
  IconArrowRight,
  IconCalendarEvent,
  IconChecklist,
  IconFolders,
  IconLayoutKanban,
  IconUsers,
  IconClock,
  IconTarget,
  IconActivity,
  IconTrendingUp,
  IconCalendar,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { DashboardSkeleton } from '@/shared/ui/Skeleton/Skeleton';
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

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof IconChecklist;
  color: string;
  accentBg: string;
  trendLabel?: string;
  onClick?: () => void;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  accentBg,
  trendLabel,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Card
        radius="lg"
        p="lg"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: 0.5 }}
            >
              {label}
            </Text>
            <Title order={3} fw={800} fz={32} lh={1.1} c="var(--app-text)">
              {value}
            </Title>
            {trendLabel && (
              <Group gap={4} mt={4}>
                <IconTrendingUp size={14} color="var(--app-success)" />
                <Text size="xs" fw={600} c="var(--app-success)">
                  {trendLabel}
                </Text>
              </Group>
            )}
          </Stack>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: accentBg,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} stroke={1.8} />
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}

interface UpcomingTaskItemProps {
  task: Task;
  onClick?: () => void;
}

function checkIsOverdue(
  dueDate?: string | null,
  isCompleted?: boolean,
): boolean {
  if (!dueDate || isCompleted) return false;
  return new Date(dueDate).getTime() < Date.now();
}

function UpcomingTaskItem({ task, onClick }: UpcomingTaskItemProps) {
  const statusMeta = STATUS_META[task.status] ?? {
    color: 'gray',
    label: task.status,
  };
  const priorityColor = PRIORITY_COLORS[task.priority] ?? 'gray';
  const isCompleted = task.status === 'Completed';
  const isOverdue = checkIsOverdue(task.dueDate, isCompleted);
  const dueDateStr = task.dueDate ? formatDate(task.dueDate) : '—';

  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ duration: 0.15 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Box
        p="sm"
        style={{
          borderRadius: 12,
          backgroundColor: isOverdue
            ? 'var(--app-danger-light)'
            : 'var(--app-surface-2)',
          border: '1px solid var(--app-border)',
          transition: 'all 150ms ease-out',
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Group gap="xs" wrap="nowrap" mb={4}>
              <Badge size="xs" variant="light" color={statusMeta.color}>
                {statusMeta.label}
              </Badge>
              <Badge size="xs" variant="outline" color={priorityColor}>
                {task.priority}
              </Badge>
            </Group>
            <Text fw={600} size="sm" lineClamp={1} c="var(--app-text)">
              {task.title}
            </Text>
          </Box>

          <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
            <Badge
              size="xs"
              variant="light"
              color={isOverdue ? 'red' : 'gray'}
              leftSection={<IconCalendarEvent size={12} />}
            >
              {isOverdue ? 'Overdue' : dueDateStr}
            </Badge>

            {task.assignedEmployee && (
              <Tooltip label={task.assignedEmployee.fullName} withArrow>
                <Badge
                  size="xs"
                  variant="light"
                  color="indigo"
                  leftSection={<IconUsers size={12} />}
                >
                  {task.assignedEmployee.fullName.charAt(0)}
                </Badge>
              </Tooltip>
            )}
          </Group>
        </Group>
      </Box>
    </motion.div>
  );
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const adminTasksQuery = useTasks({ enabled: isAdmin });
  const myTasksQuery = useMyTasks({ enabled: !isAdmin });

  const isLoading = isAdmin
    ? adminTasksQuery.isLoading
    : myTasksQuery.isLoading;
  const tasks: Task[] = isAdmin
    ? (adminTasksQuery.data ?? [])
    : (myTasksQuery.data ?? []);

  const stats = getTaskStats(tasks);
  const completion = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;
  const pct = (count: number) =>
    stats.total ? Math.round((count / stats.total) * 100) : 0;

  const statusRows = [
    {
      key: 'Completed',
      count: stats.completed,
      color: 'teal',
      label: 'Completed',
    },
    {
      key: 'In Progress',
      count: stats.inProgress,
      color: 'blue',
      label: 'In Progress',
    },
    { key: 'Pending', count: stats.pending, color: 'yellow', label: 'Pending' },
  ];

  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== 'Completed' && task.dueDate)
    .sort((a, b) => Date.parse(a.dueDate!) - Date.parse(b.dueDate!))
    .slice(0, 5);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-in">
      <Paper
        radius="lg"
        p="xl"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <div>
            <Group gap="xs" mb={4}>
              <Badge
                variant="light"
                color={isAdmin ? 'indigo' : 'teal'}
                radius="sm"
                size="sm"
              >
                {isAdmin ? 'Admin Workspace' : 'Employee Workspace'}
              </Badge>
              <Group gap={4}>
                <IconCalendar size={13} color="var(--app-text-muted)" />
                <Text size="xs" c="dimmed">
                  {todayStr}
                </Text>
              </Group>
            </Group>

            <Title order={2} fw={800} fz={26} lh={1.2}>
              Welcome back, {user?.fullName?.split(' ')[0] ?? 'there'}
            </Title>
            <Text c="dimmed" size="xs" mt={4}>
              {isAdmin
                ? 'High-level task metrics and team performance overview.'
                : 'Here is an overview of your assigned tasks and upcoming deadlines.'}
            </Text>
          </div>

          <Group gap="sm" wrap="wrap">
            {isAdmin ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<IconUsers size={16} />}
                  onClick={() => navigate(ROUTES.EMPLOYEES)}
                >
                  Employees
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<IconFolders size={16} />}
                  onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}
                >
                  Projects
                </Button>
                <Button
                  size="sm"
                  leftSection={<IconLayoutKanban size={16} />}
                  onClick={() => navigate(ROUTES.ADMIN_BOARD)}
                  style={{
                    background:
                      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    border: 'none',
                    fontWeight: 600,
                  }}
                >
                  Kanban Board
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<IconChecklist size={16} />}
                  onClick={() => navigate(ROUTES.TASKS)}
                >
                  My Tasks
                </Button>
                <Button
                  size="sm"
                  leftSection={<IconLayoutKanban size={16} />}
                  onClick={() => navigate(ROUTES.BOARD)}
                  style={{
                    background:
                      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    border: 'none',
                    fontWeight: 600,
                  }}
                >
                  My Board
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={IconChecklist}
          color="#4F46E5"
          accentBg="var(--app-primary-light)"
          onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={IconChecklist}
          color="#10B981"
          accentBg="var(--app-success-light)"
          trendLabel={`${completion}% done`}
          onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={IconActivity}
          color="#0EA5E9"
          accentBg="var(--app-info-light)"
          onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={IconClock}
          color="#F59E0B"
          accentBg="var(--app-warning-light)"
          onClick={() => navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card
          radius="lg"
          p="lg"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            boxShadow: 'var(--app-shadow-card)',
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={4} fw={700} fz={16}>
                Task Completion
              </Title>
              <Text c="dimmed" size="xs">
                Work progress across status buckets
              </Text>
            </div>
            <div
              style={{
                padding: 8,
                borderRadius: 10,
                background: 'var(--app-primary-light)',
                color: 'var(--app-primary)',
              }}
            >
              <IconTarget size={20} />
            </div>
          </Group>

          <Group justify="center" my="md">
            <RingProgress
              size={190}
              thickness={16}
              roundCaps
              sections={statusRows.map((row) => ({
                value: pct(row.count),
                color: row.color,
                tooltip: `${row.label}: ${row.count} (${pct(row.count)}%)`,
              }))}
              label={
                <div style={{ textAlign: 'center' }}>
                  <Text fz={32} fw={800} lh={1} c="var(--app-text)">
                    {completion}%
                  </Text>
                  <Text fz={11} c="dimmed" fw={600} tt="uppercase" mt={4}>
                    Completed
                  </Text>
                </div>
              }
            />
          </Group>

          <Stack gap="xs" mt="md">
            {statusRows.map((row) => (
              <Group
                key={row.key}
                justify="space-between"
                wrap="nowrap"
                p="xs"
                style={{
                  borderRadius: 8,
                  backgroundColor: 'var(--app-surface-2)',
                }}
              >
                <Group gap="xs" wrap="nowrap">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: `var(--mantine-color-${row.color}-6)`,
                      display: 'inline-block',
                    }}
                  />
                  <Text size="xs" fw={600}>
                    {row.label}
                  </Text>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <Text size="xs" fw={700}>
                    {row.count}
                  </Text>
                  <Text size="xs" c="dimmed">
                    ({pct(row.count)}%)
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Card>

        <Card
          radius="lg"
          p="lg"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            boxShadow: 'var(--app-shadow-card)',
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={4} fw={700} fz={16}>
                Upcoming Deadlines
              </Title>
              <Text c="dimmed" size="xs">
                Active tasks ordered by due date
              </Text>
            </div>
            <Badge variant="light" color="indigo" size="sm">
              {upcomingTasks.length} Due Soon
            </Badge>
          </Group>

          {upcomingTasks.length === 0 ? (
            <CenteredState
              variant="empty"
              message="No upcoming deadlines. Everything is caught up!"
              minHeight={200}
            />
          ) : (
            <Stack gap="xs">
              {upcomingTasks.map((task) => (
                <UpcomingTaskItem
                  key={task.id}
                  task={task}
                  onClick={() =>
                    navigate(
                      isAdmin
                        ? ROUTES.ADMIN_TASK_DETAILS(task.id)
                        : ROUTES.TASK_DETAILS(task.id),
                    )
                  }
                />
              ))}

              <Button
                variant="subtle"
                size="xs"
                rightSection={<IconArrowRight size={14} />}
                mt="sm"
                fullWidth
                onClick={() =>
                  navigate(isAdmin ? ROUTES.ADMIN_TASKS : ROUTES.TASKS)
                }
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
