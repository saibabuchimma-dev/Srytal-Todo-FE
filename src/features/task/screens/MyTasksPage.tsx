import {
  Card,
  Divider,
  Group,
  Paper,
  RingProgress,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import Pagination from '@/shared/ui/Pagination/Pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import TaskList from '../components/TaskList';
import { useMyTasks } from '../hooks/useTasks';
import type { TaskStatus } from '../types/task';

type StatusFilter = 'All' | TaskStatus;

export default function MyTasksPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const { page, setPage, limit, setLimit, reset } = usePagination({ initialLimit: 10 });
  const { data: tasks = [], isLoading, isError } = useMyTasks();

  const counts = useMemo(
    () => ({
      all: tasks.length,
      Pending: tasks.filter((task) => task.status === 'Pending').length,
      'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
      Completed: tasks.filter((task) => task.status === 'Completed').length,
    }),
    [tasks],
  );

  const completion = tasks.length ? Math.round((counts.Completed / tasks.length) * 100) : 0;

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = status === 'All' || task.status === status;
      const matchesSearch =
        !keyword ||
        [task.title, task.description, task.projectDetails?.name]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, search, status]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) {
    setPage(totalPages);
  }
  const pageTasks = filtered.slice((page - 1) * limit, page * limit);

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const handleStatus = (value: string) => {
    setStatus(value as StatusFilter);
    reset();
  };

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading your tasks..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="Failed to load your tasks." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <div>
            <Title order={2}>My Tasks</Title>
            <Text c="dimmed" mt={4}>
              {counts.all === 0
                ? 'No tasks assigned to you yet.'
                : `You have ${counts.all} task${counts.all === 1 ? '' : 's'} assigned — ${counts.Completed} completed.`}
            </Text>
          </div>

          {tasks.length > 0 && (
            <Group gap="sm" wrap="nowrap">
              <RingProgress
                size={66}
                thickness={7}
                roundCaps
                sections={[{ value: completion, color: 'green' }]}
                label={
                  <Text ta="center" fw={700} size="xs">
                    {completion}%
                  </Text>
                }
              />
              <div>
                <Text size="sm" fw={600}>
                  Completion
                </Text>
                <Text size="xs" c="dimmed">
                  {counts.Completed} of {counts.all} done
                </Text>
              </div>
            </Group>
          )}
        </Group>
      </Paper>

      <Card withBorder radius="lg">
        <Stack>
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <SegmentedControl
              value={status}
              onChange={handleStatus}
              data={[
                { label: `All ${counts.all}`, value: 'All' },
                { label: `Pending ${counts.Pending}`, value: 'Pending' },
                { label: `In Progress ${counts['In Progress']}`, value: 'In Progress' },
                { label: `Completed ${counts.Completed}`, value: 'Completed' },
              ]}
            />

            <TextInput
              placeholder="Search tasks..."
              leftSection={<IconSearch size={16} />}
              radius="md"
              value={search}
              onChange={(event) => handleSearch(event.currentTarget.value)}
              style={{ flex: '1 1 200px', maxWidth: 300 }}
            />
          </Group>

          <Divider />

          {total === 0 ? (
            <CenteredState
              variant="empty"
              minHeight={200}
              message={
                search || status !== 'All'
                  ? 'No tasks match your filters.'
                  : 'No tasks assigned to you yet.'
              }
            />
          ) : (
            <TaskList tasks={pageTasks} readOnly />
          )}

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </Stack>
      </Card>
    </div>
  );
}
