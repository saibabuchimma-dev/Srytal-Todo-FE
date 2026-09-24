import { motion } from 'framer-motion';
import { SimpleGrid, Stack, Text, Group } from '@mantine/core';
import {
  IconLayoutKanban,
  IconClock,
  IconActivity,
  IconChecklist,
} from '@tabler/icons-react';
import { useState, useCallback, useMemo } from 'react';

import { TASK_STATUS_OPTIONS } from '../constants/task.constants';
import type { Task, TaskStatus } from '../types/task';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  updatingTaskId: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const COLUMN_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; icon: typeof IconClock }
> = {
  Pending: { label: 'Pending', color: 'yellow', icon: IconClock },
  'In Progress': { label: 'In Progress', color: 'blue', icon: IconActivity },
  Completed: { label: 'Completed', color: 'teal', icon: IconChecklist },
};

export default function KanbanBoard({
  tasks,
  updatingTaskId,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);

  const columns = useMemo(
    () =>
      TASK_STATUS_OPTIONS.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        const config = COLUMN_CONFIG[status];
        return {
          status,
          label: config.label,
          color: config.color,
          tasks: columnTasks,
          count: columnTasks.length,
        };
      }),
    [tasks],
  );

  const handleDrop = useCallback(
    (status: TaskStatus) => {
      const task = draggingTask;
      setOverStatus(null);
      setDraggingTask(null);

      if (!task || task.status === status) {
        return;
      }

      onStatusChange(task.id, status);
    },
    [draggingTask, onStatusChange],
  );

  if (tasks.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 380,
          backgroundColor: 'var(--app-surface)',
          borderRadius: 16,
          border: '1px dashed var(--app-border)',
          padding: 32,
        }}
      >
        <IconLayoutKanban
          size={48}
          style={{ color: 'var(--app-text-muted)', opacity: 0.4 }}
        />
        <Stack align="center" gap={6} mt="md">
          <Text fw={700} size="base" c="var(--app-text)">
            No tasks found
          </Text>
          <Text c="dimmed" size="xs" ta="center" maw={320}>
            Create tasks to begin organizing your work visually across Kanban
            columns.
          </Text>
        </Stack>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text
            size="xs"
            c="dimmed"
            fw={600}
            tt="uppercase"
            style={{ letterSpacing: 0.6 }}
          >
            {tasks.length} total tasks across 3 stages
          </Text>
        </Group>

        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing="md"
          style={{ alignItems: 'flex-start' }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              label={column.label}
              color={column.color}
              count={column.count}
              tasks={column.tasks}
              isOver={
                overStatus === column.status &&
                draggingTask?.status !== column.status
              }
              updatingTaskId={updatingTaskId}
              onDragStart={setDraggingTask}
              onDragEnd={() => {
                setDraggingTask(null);
                setOverStatus(null);
              }}
              onDragOver={setOverStatus}
              onDrop={handleDrop}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </motion.div>
  );
}
