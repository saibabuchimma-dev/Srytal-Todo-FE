import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';

import { useEmployeeStore } from '../store/employee.store';
import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const isSelected = selectedEmployee?.id === employee.id;

  return (
    <Card
      withBorder
      radius="lg"
      p="md"
      onClick={() => setSelectedEmployee(employee)}
      className={`
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
      `}
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
