import { Badge, Divider, Group, Modal, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { ProjectTask } from '@/features/project/types/project';

interface Props {
  opened: boolean;
  onClose: () => void;
  task?: ProjectTask | null;
}

export default function TaskDetailsModal({ opened, onClose, task }: Props) {
  if (!task) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Task Details" centered size="lg">
      <Stack>
        <Text fw={700}>{task.title}</Text>
        <Text c="dimmed">{task.description}</Text>
        <Divider />

        <Group justify="space-between">
          <Text>Status</Text>
          <Badge>{task.status}</Badge>
        </Group>

        <Group justify="space-between">
          <Text>Priority</Text>
          <Badge color="orange">{task.priority}</Badge>
        </Group>

        <Group justify="space-between">
          <Text>Assigned To</Text>
          <Text>{task.assignedTo?.fullName ?? '-'}</Text>
        </Group>

        <Group justify="space-between">
          <Text>Due Date</Text>
          <Text>{dayjs(task.dueDate).format('DD MMM YYYY')}</Text>
        </Group>
      </Stack>
    </Modal>
  );
}
