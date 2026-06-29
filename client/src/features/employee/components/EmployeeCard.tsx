import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';

import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

export default function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <Card
      withBorder
      radius="lg"
      p="sm"
      className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      <Group justify="space-between">
        <Group>
          <Avatar src={employee.avatar} radius="xl" />

          <Stack gap={2}>
            <Text fw={600}>{employee.name}</Text>

            <Text size="xs" c="dimmed">
              {employee.designation}
            </Text>
          </Stack>
        </Group>

        <Badge color={employee.status === 'Online' ? 'green' : 'gray'}>{employee.status}</Badge>
      </Group>
    </Card>
  );
}
