import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { useEmployeeStore } from '../store/employee.store';

export default function EmployeeHeader() {
  const { selectedEmployee } = useEmployeeStore();

  if (!selectedEmployee) {
    return <Text c="dimmed">No employee selected.</Text>;
  }

  return (
    <Card withBorder radius="md" shadow="sm">
      <Group justify="space-between">
        <Group>
          <Avatar src={selectedEmployee.avatar} size="lg" radius="xl" />

          <Stack gap={2}>
            <Text fw={700} size="lg">
              {selectedEmployee.fullName}
            </Text>

            <Text size="sm" c="dimmed">
              {selectedEmployee.email}
            </Text>
          </Stack>
        </Group>

        <Badge color={selectedEmployee.role === 'Admin' ? 'red' : 'blue'} variant="light">
          {selectedEmployee.role}
        </Badge>
      </Group>
    </Card>
  );
}
