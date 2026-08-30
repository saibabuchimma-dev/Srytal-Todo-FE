import { ActionIcon, Badge, Card, Group, Menu, Stack, Text } from '@mantine/core';
import {
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/config/routes';
import { formatDate } from '@/shared/utils/date';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  readOnly?: boolean;
}

const statusColors: Record<string, string> = {
  Pending: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
};

const priorityColors: Record<string, string> = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
};

export default function TaskCard({ task, onEdit, onDelete, readOnly = false }: TaskCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const statusColor = statusColors[task.status] ?? 'gray';
  const priorityColor = priorityColors[task.priority] ?? 'gray';

  const [now] = useState(() => Date.now());
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    !!due && task.status !== 'Completed' && !Number.isNaN(due.getTime()) && due.getTime() < now;

  const handleView = () => {
    const route =
      user?.role === 'Admin' ? ROUTES.ADMIN_TASK_DETAILS(task.id) : ROUTES.TASK_DETAILS(task.id);
    void navigate(route);
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card
        withBorder
        radius="md"
        p="md"
        className="cursor-pointer"
        onClick={handleView}
        style={{ borderLeft: `4px solid var(--mantine-color-${statusColor}-6)` }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={6} style={{ minWidth: 0, flex: 1 }}>
            <Text fw={600} lineClamp={1}>
              {task.title}
            </Text>

            {task.description && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {task.description}
              </Text>
            )}

            <Group gap="lg" wrap="wrap" mt={2}>
              {task.projectDetails && (
                <Group gap={5} wrap="nowrap">
                  <IconFolder size={14} style={{ color: 'var(--app-accent)' }} />
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {task.projectDetails.name}
                  </Text>
                </Group>
              )}

              {due && (
                <Group gap={5} wrap="nowrap">
                  <IconCalendar
                    size={14}
                    style={{ color: isOverdue ? 'var(--app-danger)' : 'var(--app-text-muted)' }}
                  />
                  <Text size="xs" c={isOverdue ? 'red' : 'dimmed'} fw={isOverdue ? 600 : 400}>
                    {formatDate(task.dueDate)}
                    {isOverdue ? ' · Overdue' : ''}
                  </Text>
                </Group>
              )}

              {!readOnly && task.assignedEmployee && (
                <Group gap={5} wrap="nowrap">
                  <IconUser size={14} style={{ color: 'var(--app-text-muted)' }} />
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {task.assignedEmployee.fullName}
                  </Text>
                </Group>
              )}
            </Group>

            <Group gap="xs" mt={4}>
              <Badge color={statusColor} variant="light" size="sm">
                {task.status}
              </Badge>
              <Badge color={priorityColor} variant="light" size="sm">
                {task.priority} priority
              </Badge>
            </Group>
          </Stack>

          {!readOnly && (
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(task);
                  }}
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(task);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Card>
    </motion.div>
  );
}
