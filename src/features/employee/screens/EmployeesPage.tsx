import { Alert, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconUsers } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import EmployeeSearch from '../components/EmployeeSearch';
import EmployeeList from '../components/EmployeeList';
import { useEmployees } from '../hooks/useEmployees';
import Loader from '@/styles/loader';

export function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [createOpened, setCreateOpened] = useState(false);
  const { data: employees = [], isLoading, isError } = useEmployees();

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return employees;
    }

    return employees.filter((employee) => {
      return [employee.name, employee.email, employee.designation].some((value) =>
        value.toLowerCase().includes(term),
      );
    });
  }, [employees, search]);

  const taskCounts = useMemo(() => {
    return employees.reduce<Record<string, number>>((counts, employee) => {
      counts[employee.id] = 0;
      return counts;
    }, {});
  }, [employees]);

  if (isLoading) {
    return <Loader label="Loading employees" size={44} />;
  }

  if (isError) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
        Employees could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper radius="lg" p="lg" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>Employee Management</Title>
            <Text c="dimmed" mt="xs">
              Search, review, and manage employee records from one page.
            </Text>
          </div>
          <Group>
            <Button onClick={() => setCreateOpened(true)}>Create Employee</Button>
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-600">
              <IconUsers size={24} />
            </div>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder radius="lg" p="lg">
          <Title order={4}>Employees Overview</Title>
          <Text c="dimmed" mt="xs">
            Total employees: {employees.length}
          </Text>
        </Card>
        <Card withBorder radius="lg" p="lg">
          <Title order={4}>Quick Access</Title>
          <Text c="dimmed" mt="xs">
            Use the search bar to find employees quickly or open a profile from the list.
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="lg" p="lg">
        <Stack gap="md">
          <EmployeeSearch value={search} onChange={setSearch} />
          {filteredEmployees.length === 0 ? (
            <Text c="dimmed">No employees match your search.</Text>
          ) : (
            <EmployeeList employees={filteredEmployees} taskCounts={taskCounts} />
          )}
        </Stack>
      </Card>

      <CreateEmployeeModal opened={createOpened} onClose={() => setCreateOpened(false)} />
    </div>
  );
}
