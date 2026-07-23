import { SimpleGrid } from '@mantine/core';
import { useMemo, useState } from 'react';

import { TASK_STATUS_OPTIONS } from '../constants/task.constants';
import type { Task, TaskStatus } from '../types/task';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  updatingTaskId: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export default function KanbanBoard({ tasks, updatingTaskId, onStatusChange }: KanbanBoardProps) {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);

  const columns = useMemo(
    () =>
      TASK_STATUS_OPTIONS.map((status) => ({
        status,
        tasks: tasks.filter((task) => task.status === status),
      })),
    [tasks],
  );

  const handleDrop = (status: TaskStatus) => {
    const task = draggingTask;
    setOverStatus(null);
    setDraggingTask(null);

    if (!task || task.status === status) {
      return;
    }

    onStatusChange(task.id, status);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          tasks={column.tasks}
          isOver={overStatus === column.status && draggingTask?.status !== column.status}
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
  );
}
