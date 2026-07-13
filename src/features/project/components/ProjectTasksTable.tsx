import { Badge, Group, Paper, Table, Text, ActionIcon } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { ProjectTask } from '../types/project';

interface Props {
  tasks: ProjectTask[];
  onView(task: ProjectTask): void;
  onEdit(task: ProjectTask): void;
  onDelete(task: ProjectTask): void;
}

const statusColor = {
  Pending: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
} as const;

const priorityColor = {
  Low: 'gray',
  Medium: 'yellow',
  High: 'red',
} as const;

export default function ProjectTasksTable({ tasks, onView, onEdit, onDelete }: Props) {
  return (
    <Paper shadow="xs" p="md" radius="md" mt="lg">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">
          Project Tasks
        </Text>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Task</Table.Th>
            <Table.Th>Assigned To</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Due Date</Table.Th>
            <Table.Th style={{ width: 120 }}>Actions</Table.Th>{' '}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {tasks.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed">
                  No tasks found.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            tasks.map((task) => (
              <Table.Tr key={task._id}>
                <Table.Td>
                  <Text fw={600}>{task.title}</Text>

                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {task.description}
                  </Text>
                </Table.Td>

                <Table.Td>{task.assignedTo?.fullName ?? '-'}</Table.Td>

                <Table.Td>
                  <Badge color={statusColor[task.status]}>{task.status}</Badge>
                </Table.Td>

                <Table.Td>
                  <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
                </Table.Td>

                <Table.Td>{dayjs(task.dueDate).format('DD MMM YYYY')}</Table.Td>

                <Table.Td>
                  <Group gap={5}>
                    <ActionIcon variant="light" color="blue" onClick={() => onView(task)}>
                      <IconEye size={16} />
                    </ActionIcon>

                    <ActionIcon variant="light" color="yellow" onClick={() => onEdit(task)}>
                      <IconEdit size={16} />
                    </ActionIcon>

                    <ActionIcon variant="light" color="red" onClick={() => onDelete(task)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
