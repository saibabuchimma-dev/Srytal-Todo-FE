import { Alert, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconChecklist } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import Loader from '@/styles/loader';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import TaskList from '../components/TaskList';
import TaskSearch from '../components/TaskSearch';
import { useDeleteTask, useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data: tasks = [], isLoading, isError } = useTasks();
  const deleteTaskMutation = useDeleteTask();

  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return tasks;
    }

    return tasks.filter((task) =>
      [task.title, task.description, task.status, task.priority, task.assignedEmployee?.fullName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword)),
    );
  }, [tasks, search]);

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
    return <Loader label="Loading tasks..." size={44} />;
  }

  if (isError) {
    return (
      <Alert radius="md" color="red" icon={<IconAlertCircle size={18} />}>
        Tasks could not be loaded.
      </Alert>
    );
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
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <IconChecklist size={24} />
            </div>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder radius="lg">
          <Title order={4}>Total Tasks</Title>
          <Text mt="xs" c="dimmed">
            {tasks.length}
          </Text>
        </Card>
        <Card withBorder radius="lg">
          <Title order={4}>Search</Title>
          <Text mt="xs" c="dimmed">
            Find tasks quickly.
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="lg">
        <Stack>
          <TaskSearch value={search} onChange={setSearch} />
          <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />
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
