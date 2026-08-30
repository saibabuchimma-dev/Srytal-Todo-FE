import { Button, Card, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconChecklist } from '@tabler/icons-react';
import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import Pagination from '@/shared/ui/Pagination/Pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import TaskList from '../components/TaskList';
import TaskSearch from '../components/TaskSearch';
import { useDeleteTask, usePaginatedTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 350);
  const { page, setPage, limit, setLimit, reset } = usePagination({ initialLimit: 10 });

  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading, isFetching, isError } = usePaginatedTasks({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
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
    return <CenteredState variant="loading" label="Loading tasks..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="Tasks could not be loaded." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Task Management</Title>
            <Text c="dimmed">Create, assign and manage project tasks.</Text>
          </div>
          <Group>
            <Button onClick={() => setCreateOpened(true)}>Create Task</Button>
            <div
              className="rounded-full p-3"
              style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
            >
              <IconChecklist size={24} />
            </div>
          </Group>
        </Group>
      </Paper>

      <Card withBorder radius="lg">
        <Stack>
          <TaskSearch value={search} onChange={handleSearch} />

          {tasks.length === 0 ? (
            <Text c="dimmed" py="md" ta="center">
              {debouncedSearch ? 'No tasks match your search.' : 'No tasks yet.'}
            </Text>
          ) : (
            <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
          )}

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

      <CreateTaskModal opened={createOpened} onClose={() => setCreateOpened(false)} />

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
