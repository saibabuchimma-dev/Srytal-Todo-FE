import { Stack } from '@mantine/core';

import TaskCard from './TaskCard';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  readOnly?: boolean;
}

export default function TaskList({ tasks, onEdit, onDelete, readOnly = false }: TaskListProps) {
  return (
    <Stack gap="sm">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </Stack>
  );
}
