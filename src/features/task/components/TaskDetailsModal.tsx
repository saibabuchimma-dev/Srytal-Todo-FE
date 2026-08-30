import { Badge, Divider, Group, Text } from '@mantine/core';
import { IconClipboardText } from '@tabler/icons-react';

import AppModal from '@/shared/ui/Modal/AppModal';
import { formatDate } from '@/shared/utils/date';
import type { ProjectTask } from '@/features/project/types/project';

interface Props {
  opened: boolean;
  onClose: () => void;
  task?: ProjectTask | null;
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

export default function TaskDetailsModal({ opened, onClose, task }: Props) {
  if (!task) return null;

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      icon={<IconClipboardText size={20} />}
      title="Task Details"
      subtitle={task.title}
      size="lg"
      hideFooter
    >
      <Text c="dimmed">{task.description || 'No description provided.'}</Text>
      <Divider />

      <Group justify="space-between">
        <Text c="dimmed">Status</Text>
        <Badge color={statusColors[task.status] ?? 'gray'} variant="light">
          {task.status}
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text c="dimmed">Priority</Text>
        <Badge color={priorityColors[task.priority] ?? 'gray'} variant="light">
          {task.priority}
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text c="dimmed">Assigned To</Text>
        <Text fw={500}>{task.assignedTo?.fullName ?? '—'}</Text>
      </Group>

      <Group justify="space-between">
        <Text c="dimmed">Due Date</Text>
        <Text fw={500}>{task.dueDate ? formatDate(task.dueDate) : '—'}</Text>
      </Group>
    </AppModal>
  );
}
