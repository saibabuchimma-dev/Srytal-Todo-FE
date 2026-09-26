import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Table,
  TextInput,
  Select,
  Badge,
  Menu,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Grid,
} from '@mantine/core';
import {
  IconChecklist,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconArrowsUpDown,
  IconPlus,
  IconFolder,
  IconCalendar,
  IconUser,
} from '@tabler/icons-react';
import { usePagination } from '@/shared/hooks/usePagination';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { Pagination } from '@/shared/ui/Pagination/Pagination';
import { TableSkeleton } from '@/shared/ui/Skeleton/Skeleton';
import { formatDate } from '@/shared/utils/date';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { useDeleteTask, usePaginatedTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

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

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

function checkIsOverdue(
  dueDate?: string | null,
  isCompleted?: boolean,
): boolean {
  if (!dueDate || isCompleted) return false;
  return new Date(dueDate).getTime() < Date.now();
}

function TaskRow({ task, onEdit, onDelete, onView }: TaskRowProps) {
  const statusMeta = STATUS_META[task.status] ?? {
    color: 'gray',
    label: task.status,
  };
  const priorityColor = PRIORITY_COLORS[task.priority] ?? 'gray';
  const isCompleted = task.status === 'Completed';
  const isOverdue = checkIsOverdue(task.dueDate, isCompleted);

  return (
    <Table.Tr
      style={{
        cursor: 'pointer',
        transition: 'background-color 140ms ease',
      }}
      className="hover:bg-[var(--app-surface-hover)]"
      onClick={() => onView(task)}
    >
      <Table.Td style={{ minWidth: 280, paddingLeft: 16 }}>
        <Stack gap={3}>
          <Text fw={600} size="sm" lineClamp={1} c="var(--app-text)">
            {task.title}
          </Text>
          {task.description && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {task.description}
            </Text>
          )}
          <Group gap="md" wrap="wrap" mt={2}>
            {task.projectDetails && (
              <Group gap={4} wrap="nowrap">
                <IconFolder size={13} style={{ color: 'var(--app-accent)' }} />
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {task.projectDetails.name}
                </Text>
              </Group>
            )}
            {task.assignedEmployee && (
              <Group gap={4} wrap="nowrap">
                <IconUser
                  size={13}
                  style={{ color: 'var(--app-text-muted)' }}
                />
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {task.assignedEmployee.fullName}
                </Text>
              </Group>
            )}
          </Group>
        </Stack>
      </Table.Td>

      <Table.Td ta="center" style={{ minWidth: 120 }}>
        <Badge variant="light" color={statusMeta.color} size="sm">
          {statusMeta.label}
        </Badge>
      </Table.Td>

      <Table.Td ta="center" style={{ minWidth: 100 }}>
        <Badge variant="outline" color={priorityColor} size="sm">
          {task.priority}
        </Badge>
      </Table.Td>

      <Table.Td ta="center" style={{ minWidth: 120 }}>
        <Group gap={4} justify="center" wrap="nowrap">
          <IconCalendar
            size={13}
            style={{
              color: isOverdue ? 'var(--app-danger)' : 'var(--app-text-muted)',
            }}
          />
          <Text
            size="xs"
            c={isOverdue ? 'red' : 'dimmed'}
            fw={isOverdue ? 700 : 500}
          >
            {task.dueDate ? formatDate(task.dueDate) : '—'}
            {isOverdue && <span style={{ marginLeft: 4 }}>(Overdue)</span>}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td style={{ minWidth: 80, paddingRight: 16 }} ta="right">
        <Tooltip label="Actions" withArrow>
          <Menu position="bottom-end" width={160} shadow="md" radius="md">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="Task actions"
                onClick={(e) => e.stopPropagation()}
                size="sm"
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={15} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(task);
                }}
              >
                View
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEdit size={15} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={15} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  );
}

function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onView,
  loading,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  loading?: boolean;
}) {
  if (loading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (tasks.length === 0) {
    return (
      <CenteredState
        variant="empty"
        message="No tasks found matching your filters."
        minHeight={200}
      />
    );
  }

  return (
    <ScrollArea style={{ maxHeight: 'calc(100vh - 360px)' }}>
      <Table
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="md"
        withTableBorder
        styles={{
          table: {
            minWidth: 680,
            borderColor: 'var(--app-border)',
            backgroundColor: 'var(--app-surface)',
          },
          thead: {
            backgroundColor: 'var(--app-surface-2)',
            borderBottom: '1px solid var(--app-border)',
          },
          th: {
            color: 'var(--app-text-muted)',
            fontWeight: 700,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            paddingTop: 12,
            paddingBottom: 12,
          },
          td: {
            borderColor: 'var(--app-border)',
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ paddingLeft: 16 }}>Task</Table.Th>
            <Table.Th ta="center">Status</Table.Th>
            <Table.Th ta="center">Priority</Table.Th>
            <Table.Th ta="center">Due Date</Table.Th>
            <Table.Th style={{ paddingRight: 16 }} ta="right">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'
  >('createdAt');
  const { page, setPage, limit, setLimit, reset } = usePagination({
    initialLimit: 10,
  });

  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading, isFetching, isError } = usePaginatedTasks({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    status:
      statusFilter !== 'all'
        ? (statusFilter as import('../types/task').TaskStatus)
        : undefined,
    priority:
      priorityFilter !== 'all'
        ? (priorityFilter as import('../types/task').TaskPriority)
        : undefined,
  });

  const tasks = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (data && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const deleteTaskMutation = useDeleteTask();

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpened(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteOpened(true);
  };

  const handleView = (task: Task) => {
    navigate(`/admin/dashboard/tasks/${task.id}`);
  };

  const confirmDelete = () => {
    if (!selectedTask) return;

    deleteTaskMutation.mutate(selectedTask.id, {
      onSuccess: () => {
        setDeleteOpened(false);
        setSelectedTask(null);
      },
    });
  };

  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  if (isError) {
    return (
      <CenteredState variant="error" message="Tasks could not be loaded." />
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-in">
      <Paper
        radius="lg"
        p="lg"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
        }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                background: 'var(--app-primary-light)',
                color: 'var(--app-primary)',
              }}
            >
              <IconChecklist size={24} />
            </div>
            <div>
              <Title order={2} fw={800} fz={22}>
                Task Management
              </Title>
              <Text c="dimmed" size="xs">
                Create, track, and manage workspace tasks with full visibility.
              </Text>
            </div>
          </Group>

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpened(true)}
            w={{ base: '100%', sm: 'auto' }}
            style={{
              background: 'var(--app-brand-gradient)',
              color: 'var(--app-brand-on)',
              fontWeight: 600,
            }}
          >
            Create Task
          </Button>
        </Group>
      </Paper>

      <Card
        radius="lg"
        p="lg"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
        }}
      >
        <Stack gap="md">
          <Grid align="center" gap="sm">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Search by title..."
                leftSection={<IconSearch size={16} />}
                radius="md"
                size="sm"
                value={search}
                onChange={(e) => handleSearch(e.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
              <Select
                placeholder="Status"
                leftSection={<IconFilter size={15} />}
                radius="md"
                size="sm"
                data={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                ]}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value ?? 'all');
                  reset();
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
              <Select
                placeholder="Priority"
                leftSection={<IconFilter size={15} />}
                radius="md"
                size="sm"
                data={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]}
                value={priorityFilter}
                onChange={(value) => {
                  setPriorityFilter(value ?? 'all');
                  reset();
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4, md: 2 }}>
              <Select
                placeholder="Sort By"
                leftSection={<IconArrowsUpDown size={15} />}
                radius="md"
                size="sm"
                data={[
                  { value: 'createdAt', label: 'Created' },
                  { value: 'title', label: 'Title' },
                  { value: 'dueDate', label: 'Due Date' },
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value as typeof sortBy)}
              />
            </Grid.Col>
          </Grid>

          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            loading={isFetching}
          />

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            loading={isFetching}
          />
        </Stack>
      </Card>

      <CreateTaskModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
      />
      <EditTaskModal
        opened={editOpened}
        task={selectedTask}
        onClose={() => {
          setEditOpened(false);
          setSelectedTask(null);
        }}
      />
      <ConfirmDeleteModal
        opened={deleteOpened}
        onClose={() => {
          setDeleteOpened(false);
          setSelectedTask(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteTaskMutation.isPending}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title ?? ''}"?`}
      />
    </div>
  );
}
