import { Avatar, Card, Group, Loader, Stack, Text } from '@mantine/core';
import { IconCalendar, IconFolder } from '@tabler/icons-react';
import { useState } from 'react';

import { TASK_PRIORITY_COLORS } from '../constants/task.constants';
import { formatDate } from '@/shared/utils/date';
import type { Task } from '../types/task';

interface KanbanCardProps {
  task: Task;
  isUpdating?: boolean;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

export default function KanbanCard({ task, isUpdating, onDragStart, onDragEnd }: KanbanCardProps) {
  const [now] = useState(() => Date.now());
  const priorityColor = TASK_PRIORITY_COLORS[task.priority];

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!due && task.status !== 'Completed' && !Number.isNaN(due.getTime()) && due.getTime() < now;

  const assignee = task.assignedEmployee?.fullName;

  return (
    <div
      draggable={!isUpdating}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', task.id);
        event.dataTransfer.effectAllowed = 'move';
        onDragStart(task);
      }}
      onDragEnd={onDragEnd}
      className={isUpdating ? 'cursor-progress' : 'cursor-grab active:cursor-grabbing'}
      style={{ opacity: isUpdating ? 0.6 : 1 }}
    >
      <Card withBorder radius="md" p="sm" shadow="xs">
        <Stack gap={8}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Text fw={600} size="sm" lineClamp={2}>
              {task.title}
            </Text>

            {isUpdating ? (
              <Loader size={14} />
            ) : (
              <Group gap={5} wrap="nowrap" style={{ flexShrink: 0 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: `var(--mantine-color-${priorityColor}-6)`,
                    display: 'inline-block',
                  }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  {task.priority}
                </Text>
              </Group>
            )}
          </Group>

          {task.description && (
            <Text size="xs" c="dimmed" lineClamp={2}>
              {task.description}
            </Text>
          )}

          {task.projectDetails && (
            <Group gap={5} wrap="nowrap">
              <IconFolder size={13} style={{ color: 'var(--app-text-muted)' }} />
              <Text size="xs" c="dimmed" lineClamp={1}>
                {task.projectDetails.name}
              </Text>
            </Group>
          )}

          <Group justify="space-between" gap={6} wrap="nowrap" mt={2}>
            <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
              {assignee ? (
                <>
                  <Avatar size={22} radius="xl" color="gray">
                    {assignee.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {assignee}
                  </Text>
                </>
              ) : (
                <Text size="xs" c="dimmed">
                  Unassigned
                </Text>
              )}
            </Group>

            {due && (
              <Group gap={3} wrap="nowrap">
                <IconCalendar
                  size={13}
                  style={{ color: isOverdue ? 'var(--app-danger)' : 'var(--app-text-muted)' }}
                />
                <Text size="xs" c={isOverdue ? 'red' : 'dimmed'} fw={isOverdue ? 600 : 400}>
                  {formatDate(task.dueDate)}
                </Text>
              </Group>
            )}
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
