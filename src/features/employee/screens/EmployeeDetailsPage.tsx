import { Alert, Card, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import DashboardStats from '@/features/dashboard/components/DashboardStats';
import EmployeeHeader from '../components/EmployeeHeader';
import { useEmployee } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/employee.store';
import { useTasks } from '@/features/task/hooks/useTasks';
import TaskList from '@/features/task/components/TaskList';
import Loader from '@/styles/loader';

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams();

  const setSelectedEmployee = useEmployeeStore((state) => state.setSelectedEmployee);

  const { data: employee, isLoading, isError } = useEmployee(employeeId ?? '');

  const { data: tasks = [], isLoading: isTasksLoading } = useTasks();

  const employeeTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === employeeId),
    [tasks, employeeId],
  );

  useEffect(() => {
    if (employee) {
      setSelectedEmployee(employee);
    }
  }, [employee, setSelectedEmployee]);

  if (!employeeId) {
    return <Navigate to="/admin/dashboard/employees" replace />;
  }

  if (isLoading || isTasksLoading) {
    return <Loader label="Loading employee..." size={44} />;
  }

  if (isError || !employee) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />}>
        Employee details could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <EmployeeHeader />

      <DashboardStats />

      <Card withBorder radius="lg">
        <Stack gap="md">
          <div>
            <Title order={4}>Employee Tasks</Title>
            <Text c="dimmed" size="sm">
              {employeeTasks.length} task{employeeTasks.length === 1 ? '' : 's'} assigned to{' '}
              {employee.fullName}
            </Text>
          </div>

          <TaskList tasks={employeeTasks} readOnly />
        </Stack>
      </Card>
    </div>
  );
}
