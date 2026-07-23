import { Badge, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { TASK_STATUS_COLORS } from '../constants/task.constants';
import type { Task, TaskStatus } from '../types/task';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isOver: boolean;
  updatingTaskId: string | null;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (status: TaskStatus) => void;
  onDrop: (status: TaskStatus) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  isOver,
  updatingTaskId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  return (
    <Paper
      withBorder
      radius="lg"
      p="sm"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        onDragOver(status);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(status);
      }}
      style={{
        backgroundColor: isOver ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-gray-0)',
        borderColor: isOver ? 'var(--mantine-color-blue-4)' : undefined,
        borderStyle: isOver ? 'dashed' : 'solid',
        transition: 'background-color 120ms ease, border-color 120ms ease',
        minWidth: 260,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Group justify="space-between" mb="xs" px={4}>
        <Group gap={8}>
          <Badge color={TASK_STATUS_COLORS[status]} variant="light" radius="sm">
            {status}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" fw={600}>
          {tasks.length}
        </Text>
      </Group>

      <ScrollArea.Autosize mah={560} type="hover" offsetScrollbars>
        <Stack gap="xs" pr={4} mih={80}>
          {tasks.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="lg">
              Drop tasks here
            </Text>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                isUpdating={updatingTaskId === task.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Paper>
  );
}
