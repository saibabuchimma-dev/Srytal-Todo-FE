import { motion } from 'framer-motion';
import { Avatar, Badge, Card, Group, Loader, Stack, Text } from '@mantine/core';
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

export default function KanbanCard({
  task,
  isUpdating,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  const [now] = useState(() => Date.now());
  const priorityColor = TASK_PRIORITY_COLORS[task.priority];

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!due &&
    task.status !== 'Completed' &&
    !Number.isNaN(due.getTime()) &&
    due.getTime() < now;

  const assignee = task.assignedEmployee?.fullName;

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  const handleDragEnd = (event: React.DragEvent) => {
    event.preventDefault();
    onDragEnd();
  };

  return (
    <div
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={
        isUpdating ? 'cursor-progress' : 'cursor-grab active:cursor-grabbing'
      }
    >
      <motion.div
        layout
        style={{ opacity: isUpdating ? 0.6 : 1 }}
        whileHover={{
          y: -2,
          boxShadow:
            '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 4px 10px -5px rgba(15, 23, 42, 0.04)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card
          withBorder
          radius="lg"
          p="md"
          shadow="sm"
          style={{
            borderLeft: `4px solid var(--mantine-color-${priorityColor}-6)`,
            transition: 'all 200ms ease-out',
          }}
        >
          <Stack gap={10}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Text fw={600} size="sm" lineClamp={2}>
                {task.title}
              </Text>

              {isUpdating ? (
                <Loader size={14} />
              ) : (
                <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {task.description}
                </Text>
              </motion.div>
            )}

            {task.projectDetails && (
              <Group gap={6} wrap="nowrap">
                <IconFolder size={13} style={{ color: 'var(--app-accent)' }} />
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {task.projectDetails.name}
                </Text>
              </Group>
            )}

            <Group justify="space-between" gap={6} wrap="nowrap" mt={2}>
              <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
                {assignee ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Group gap={4} wrap="nowrap">
                      <Avatar size={22} radius="xl" color="gray">
                        {assignee.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {assignee}
                      </Text>
                    </Group>
                  </motion.div>
                ) : (
                  <Text size="xs" c="dimmed">
                    Unassigned
                  </Text>
                )}
              </Group>

              {due && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Group gap={3} wrap="nowrap">
                    <IconCalendar
                      size={13}
                      style={{
                        color: isOverdue
                          ? 'var(--app-danger)'
                          : 'var(--app-text-muted)',
                      }}
                    />
                    <Text
                      size="xs"
                      c={isOverdue ? 'red' : 'dimmed'}
                      fw={isOverdue ? 600 : 400}
                    >
                      {formatDate(task.dueDate)}
                      {isOverdue && (
                        <span style={{ marginLeft: 4 }}>· Overdue</span>
                      )}
                    </Text>
                  </Group>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <Badge
                  size="xs"
                  variant="light"
                  color={TASK_PRIORITY_COLORS[task.priority]}
                >
                  {task.priority}
                </Badge>
              </motion.div>
            </Group>
          </Stack>
        </Card>
      </motion.div>
    </div>
  );
}
