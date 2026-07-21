import { Badge, Card, Group, Loader, Stack, Text } from '@mantine/core';
import { IconCalendar, IconFolder } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TASK_PRIORITY_COLORS } from '../constants/task.constants';
import type { Task } from '../types/task';

interface KanbanCardProps {
  task: Task;
  isUpdating?: boolean;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

export default function KanbanCard({ task, isUpdating, onDragStart, onDragEnd }: KanbanCardProps) {
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
        <Stack gap={6}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Text fw={600} size="sm" lineClamp={2}>
              {task.title}
            </Text>

            {isUpdating ? (
              <Loader size={14} />
            ) : (
              <Badge size="sm" color={TASK_PRIORITY_COLORS[task.priority]} variant="light">
                {task.priority}
              </Badge>
            )}
          </Group>

          {task.description && (
            <Text size="xs" c="dimmed" lineClamp={2}>
              {task.description}
            </Text>
          )}

          {task.projectDetails && (
            <Group gap={4} c="blue">
              <IconFolder size={13} />
              <Text size="xs">{task.projectDetails.name}</Text>
            </Group>
          )}

          <Group justify="space-between" gap={4} mt={2}>
            {task.assignedEmployee ? (
              <Text size="xs" c="dimmed">
                {task.assignedEmployee.fullName}
              </Text>
            ) : (
              <Text size="xs" c="dimmed">
                Unassigned
              </Text>
            )}

            {task.dueDate && (
              <Group gap={3} c="dimmed">
                <IconCalendar size={13} />
                <Text size="xs">{dayjs(task.dueDate).format('DD MMM')}</Text>
              </Group>
            )}
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
