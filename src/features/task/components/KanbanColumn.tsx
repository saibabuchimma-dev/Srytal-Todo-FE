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
  const color = TASK_STATUS_COLORS[status];

  return (
    <Paper
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
        backgroundColor: isOver ? 'var(--app-accent-soft)' : 'var(--app-surface-2)',
        border: `1px ${isOver ? 'dashed' : 'solid'} ${
          isOver ? 'var(--app-primary)' : 'var(--app-border)'
        }`,
        transition: 'background-color 120ms ease, border-color 120ms ease',
        minWidth: 260,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Group justify="space-between" mb="sm" px={4}>
        <Group gap={8} wrap="nowrap">
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: `var(--mantine-color-${color}-6)`,
              display: 'inline-block',
            }}
          />
          <Text fw={700} size="sm">
            {status}
          </Text>
        </Group>

        <Badge color="gray" variant="light" radius="sm" size="sm">
          {tasks.length}
        </Badge>
      </Group>

      <ScrollArea.Autosize mah={560} type="hover" offsetScrollbars>
        <Stack gap="xs" pr={4} mih={80}>
          {tasks.length === 0 ? (
            <div
              style={{
                border: '1px dashed var(--app-border)',
                borderRadius: 'var(--mantine-radius-md)',
                padding: '28px 12px',
                textAlign: 'center',
              }}
            >
              <Text size="xs" c="dimmed">
                Drop tasks here
              </Text>
            </div>
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
