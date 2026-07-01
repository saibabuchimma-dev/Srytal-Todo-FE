import { ActionIcon, Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from '@/features/task/constants/task.constants';
import type { Task } from '@/features/task/types/task';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onComplete, onDelete, onEdit }: TaskCardProps) {
  const isCompleted = task.status === 'Completed';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card withBorder radius="md" shadow="sm" p="md">
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={4}>
              <Text fw={700}>{task.title}</Text>
              <Text size="sm" c="dimmed" lineClamp={3}>
                {task.description}
              </Text>
            </Stack>

            <Group gap={6} wrap="nowrap">
              <Tooltip label="Edit task">
                <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(task)}>
                  <IconPencil size={17} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete task">
                <ActionIcon variant="subtle" color="red" onClick={() => onDelete(task)}>
                  <IconTrash size={17} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <Group gap="xs">
            <Badge color={TASK_PRIORITY_COLORS[task.priority]} variant="light">
              {task.priority}
            </Badge>
            <Badge color={TASK_STATUS_COLORS[task.status]} variant="light">
              {task.status}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Due {dayjs(task.dueDate).format('DD MMM YYYY')}
              </Text>
              <Text size="xs" c="dimmed">
                Created {dayjs(task.createdAt).format('DD MMM YYYY')}
              </Text>
            </Stack>

            <Button
              size="xs"
              variant={isCompleted ? 'light' : 'filled'}
              color="green"
              leftSection={<IconCheck size={14} />}
              disabled={isCompleted}
              onClick={() => onComplete(task)}
            >
              Complete
            </Button>
          </Group>
        </Stack>
      </Card>
    </motion.div>
  );
}
