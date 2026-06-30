import type { Task } from '@/features/employee/types/task';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card withBorder radius="lg" shadow="sm" className="transition-all hover:shadow-lg">
      <Group justify="space-between">
        <Text fw={600}>{task.title}</Text>

        <Badge
          color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'}
        >
          {task.priority}
        </Badge>
      </Group>

      <Text mt="sm" size="sm" c="dimmed">
        {task.description}
      </Text>

      <Stack mt="md">
        <Badge
          variant="light"
          color={
            task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'blue' : 'gray'
          }
        >
          {task.status}
        </Badge>

        <Text size="xs">Due : {task.dueDate}</Text>
      </Stack>
    </Card>
  );
}
