import { ActionIcon, Badge, Button, Group, Table, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from '@/features/task/constants/task.constants';
import type { Task } from '@/features/task/types/task';

interface TaskTableProps {
  tasks: Task[];
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function TaskTable({ tasks, onComplete, onDelete, onEdit }: TaskTableProps) {
  return (
    <Table.ScrollContainer minWidth={860}>
      <Table verticalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Task</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Due Date</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tasks.map((task) => (
            <Table.Tr key={task.id}>
              <Table.Td>
                <Text fw={600}>{task.title}</Text>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {task.description}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge color={TASK_PRIORITY_COLORS[task.priority]} variant="light">
                  {task.priority}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={TASK_STATUS_COLORS[task.status]} variant="light">
                  {task.status}
                </Badge>
              </Table.Td>
              <Table.Td>{dayjs(task.dueDate).format('DD MMM YYYY')}</Table.Td>
              <Table.Td>{dayjs(task.createdAt).format('DD MMM YYYY')}</Table.Td>
              <Table.Td>
                <Group gap={6} wrap="nowrap">
                  <Tooltip label="Mark completed">
                    <Button
                      size="xs"
                      variant="light"
                      color="green"
                      leftSection={<IconCheck size={14} />}
                      disabled={task.status === 'Completed'}
                      onClick={() => onComplete(task)}
                    >
                      Complete
                    </Button>
                  </Tooltip>
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
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
