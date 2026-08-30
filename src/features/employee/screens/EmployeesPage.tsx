import { Button, Card, Divider, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPlus, IconSearch, IconUsers } from '@tabler/icons-react';
import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import Pagination from '@/shared/ui/Pagination/Pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import EmployeeTable from '../components/EmployeeTable';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import { useDeleteEmployee, usePaginatedEmployees } from '../hooks/useEmployees';
import type { Employee } from '../types/employee';

export function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 350);
  const { page, setPage, limit, setLimit, reset } = usePagination({ initialLimit: 10 });

  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data, isLoading, isFetching, isError } = usePaginatedEmployees({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
  });

  const employees = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Keep the page in range after deletes shrink the result set.
  if (data && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const deleteEmployeeMutation = useDeleteEmployee();

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading employees..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="Failed to load employees." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper p="lg" radius="lg" withBorder>
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
            >
              <IconUsers size={26} />
            </div>
            <div>
              <Title order={2}>Employee Management</Title>
              <Text c="dimmed">Manage your team members from one place.</Text>
            </div>
          </Group>

          <Button leftSection={<IconPlus size={16} />} onClick={() => setCreateOpened(true)}>
            Create Employee
          </Button>
        </Group>
      </Paper>

      <Card withBorder radius="lg" p="lg">
        <Stack>
          <Group justify="space-between" wrap="wrap" gap="sm">
            <TextInput
              placeholder="Search by name or email..."
              leftSection={<IconSearch size={16} />}
              radius="md"
              value={search}
              onChange={(event) => handleSearch(event.currentTarget.value)}
              style={{ flex: '1 1 260px', maxWidth: 360 }}
            />
            <Text size="sm" c="dimmed">
              {total} employee{total === 1 ? '' : 's'}
            </Text>
          </Group>

          <Divider />

          {employees.length === 0 ? (
            <CenteredState
              variant="empty"
              minHeight={220}
              message={
                debouncedSearch ? 'No employees match your search.' : 'No employees added yet.'
              }
            />
          ) : (
            <EmployeeTable
              employees={employees}
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

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            loading={isFetching}
          />
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
