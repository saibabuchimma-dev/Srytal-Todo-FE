import {
  Alert,
  Button,
  Group,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useEmployeeStore } from '@/features/employee/store/employee.store';
import {
  TASK_PAGE_SIZE,
  TASK_PRIORITY_OPTIONS,
  TASK_SORT_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '@/features/task/constants/task.constants';
import { useDeleteTask, useTasks, useUpdateTask } from '@/features/task/hooks/useTasks';
import type { Task, TaskPriority, TaskSortOption, TaskStatus } from '@/features/task/types/task';
import { filterTasks, getPaginatedTasks } from '@/features/task/utils/task.utils';
import TaskCard from './TaskCard';
import TaskDrawer from './TaskDrawer';
import TaskTable from './TaskTable';

export default function TaskList() {
  const selectedEmployee = useEmployeeStore((state) => state.selectedEmployee);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | 'All'>('All');
  const [priority, setPriority] = useState<TaskPriority | 'All'>('All');
  const [sort, setSort] = useState<TaskSortOption>('Newest');
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const {
    data = [],
    isError,
    isLoading,
  } = useTasks(selectedEmployee ? { employeeId: selectedEmployee.id } : {});
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const filteredTasks = useMemo(
    () => filterTasks({ tasks: data, search, status, priority, sort }),
    [data, priority, search, sort, status],
  );

  const paginatedTasks = useMemo(
    () => getPaginatedTasks(filteredTasks, page, TASK_PAGE_SIZE),
    [filteredTasks, page],
  );

  const pageCount = Math.max(1, Math.ceil(filteredTasks.length / TASK_PAGE_SIZE));

  const handleCreate = () => {
    setEditingTask(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  const handleComplete = (task: Task) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      payload: {
        status: 'Completed',
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleDelete = (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"? This action cannot be undone.`);

    if (confirmed) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTask(null);
  };

  const resetPage = () => setPage(1);

  if (!selectedEmployee) {
    return (
      <Alert color="blue" icon={<IconAlertCircle size={18} />} radius="md">
        Select an employee from the sidebar to view and manage assigned tasks.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={2}>
          <Text fw={800} size="xl">
            Tasks
          </Text>
          <Text size="sm" c="dimmed">
            {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} for{' '}
            {selectedEmployee.name}
          </Text>
        </Stack>

        <Button onClick={handleCreate}>Add Task</Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
        <TextInput
          placeholder="Search tasks"
          leftSection={<IconSearch size={17} />}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            resetPage();
          }}
        />
        <Select
          data={['All', ...TASK_STATUS_OPTIONS]}
          value={status}
          onChange={(value) => {
            setStatus((value ?? 'All') as TaskStatus | 'All');
            resetPage();
          }}
        />
        <Select
          data={['All', ...TASK_PRIORITY_OPTIONS]}
          value={priority}
          onChange={(value) => {
            setPriority((value ?? 'All') as TaskPriority | 'All');
            resetPage();
          }}
        />
        <Select
          data={TASK_SORT_OPTIONS}
          value={sort}
          onChange={(value) => {
            setSort((value ?? 'Newest') as TaskSortOption);
            resetPage();
          }}
        />
      </SimpleGrid>

      {isError ? (
        <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
          Tasks could not be loaded from JSON Server.
        </Alert>
      ) : null}

      {isLoading ? (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={148} radius="md" />
          ))}
        </SimpleGrid>
      ) : null}

      {!isLoading && filteredTasks.length === 0 ? (
        <Alert color="gray" radius="md">
          No tasks match the selected employee, search, and filters.
        </Alert>
      ) : null}

      {!isLoading && filteredTasks.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isMobile ? 'cards' : 'table'}-${page}-${search}-${status}-${priority}-${sort}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {isMobile ? (
              <SimpleGrid cols={1}>
                {paginatedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <TaskTable
                tasks={paginatedTasks}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      ) : null}

      {pageCount > 1 ? (
        <Group justify="flex-end">
          <Pagination value={page} total={pageCount} onChange={setPage} />
        </Group>
      ) : null}

      <TaskDrawer
        employeeId={selectedEmployee.id}
        task={editingTask}
        opened={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </Stack>
  );
}
