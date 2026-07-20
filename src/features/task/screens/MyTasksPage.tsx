import { Alert, Card, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Loader from '@/styles/loader';
import TaskList from '../components/TaskList';
import TaskSearch from '../components/TaskSearch';
import { useMyTasks } from '../hooks/useTasks';

export default function MyTasksPage() {
  const [search, setSearch] = useState('');
  const { data: tasks = [], isLoading, isError } = useMyTasks();
  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return tasks;
    }
    return tasks.filter((task) =>
      [task.title, task.description, task.status, task.priority, task.projectDetails?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword)),
    );
  }, [tasks, search]);

  if (isLoading) {
    return <Loader label="Loading your tasks..." size={44} />;
  }

  if (isError) {
    return (
      <Alert color="red" radius="md" icon={<IconAlertCircle size={18} />}>
        Failed to load your tasks.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Title order={2}>My Tasks</Title>
        <Text c="dimmed">View and track all tasks assigned to you.</Text>
      </Paper>

      <Card withBorder radius="lg">
        <Stack>
          <TaskSearch value={search} onChange={setSearch} />

          <TaskList tasks={filteredTasks} readOnly />
        </Stack>
      </Card>
    </div>
  );
}
