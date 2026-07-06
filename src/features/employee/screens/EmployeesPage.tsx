import { Alert, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconUsers } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Loader from '@/styles/loader';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import EmployeeList from '../components/EmployeeList';
import EmployeeSearch from '../components/EmployeeSearch';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import { useDeleteEmployee, useEmployees } from '../hooks/useEmployees';
import type { Employee } from '../types/employee';

export function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { data: employees = [], isLoading, isError } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return employees;

    return employees.filter((employee) =>
      [employee.fullName, employee.email, employee.role]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword)),
    );
  }, [employees, search]);

  const taskCounts = useMemo(() => {
    return employees.reduce<Record<string, number>>((acc, employee) => {
      acc[employee.id] = 0;
      return acc;
    }, {});
  }, [employees]);

  if (isLoading) {
    return <Loader label="Loading employees..." size={44} />;
  }

  if (isError) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />}>
        Failed to load employees.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper p="lg" radius="lg" withBorder>
        <Group justify="space-between">
          <div>
            <Title order={2}>Employee Management</Title>

            <Text c="dimmed">Manage employees from one place.</Text>
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
        <Card withBorder radius="md">
          <Title order={4}>Employees</Title>

          <Text mt="xs" c="dimmed">
            Total Employees : {employees.length}
          </Text>
        </Card>

        <Card withBorder radius="md">
          <Title order={4}>Quick Search</Title>

          <Text mt="xs" c="dimmed">
            Search employees instantly.
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="md">
        <Stack>
          <EmployeeSearch value={search} onChange={setSearch} />

          {filteredEmployees.length === 0 ? (
            <Text c="dimmed">No employees found.</Text>
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              taskCounts={taskCounts}
              onEdit={(employee) => {
                setSelectedEmployee(employee);
                setEditOpened(true);
              }}
              onDelete={(employee) => {
                setSelectedEmployee(employee);
                setDeleteOpened(true);
              }}
            />
          )}
        </Stack>
      </Card>

      <CreateEmployeeModal opened={createOpened} onClose={() => setCreateOpened(false)} />

      <EditEmployeeModal
        opened={editOpened}
        employee={selectedEmployee}
        onClose={() => {
          setEditOpened(false);
          setSelectedEmployee(null);
        }}
      />

      <ConfirmDeleteModal
        opened={deleteOpened}
        loading={deleteEmployeeMutation.isPending}
        title="Delete Employee"
        message={`Are you sure you want to delete ${
          selectedEmployee?.fullName ?? 'this employee'
        }?`}
        onClose={() => {
          setDeleteOpened(false);
          setSelectedEmployee(null);
        }}
        onConfirm={() => {
          if (!selectedEmployee) return;

          deleteEmployeeMutation.mutate(selectedEmployee.id, {
            onSuccess: () => {
              setDeleteOpened(false);
              setSelectedEmployee(null);
            },
          });
        }}
      />
    </div>
  );
}
