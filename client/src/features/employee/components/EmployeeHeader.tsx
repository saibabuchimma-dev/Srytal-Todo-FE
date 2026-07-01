import { Avatar, Card, Group, Stack, Text } from '@mantine/core';
import { useEmployeeStore } from '@/features/employee/store/employee.store';

export default function EmployeeHeader() {
  const { selectedEmployee } = useEmployeeStore();

  if (!selectedEmployee) {
    return <Text c="dimmed">Select an employee</Text>;
  }

  return (
    <Card withBorder radius="md" shadow="sm">
      <Group>
        <Avatar src={selectedEmployee.avatar} size="lg" />
        <Stack gap={0}>
          <Text fw={800}>{selectedEmployee.name}</Text>
          <Text size="sm" c="dimmed">
            {selectedEmployee.designation}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
