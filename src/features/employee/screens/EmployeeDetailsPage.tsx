import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import {
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconProgress,
} from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import StatsCard from '@/features/dashboard/components/StatsCard';
import BackButton from '@/shared/ui/BackButton/BackButton';
import EmployeeHeader from '../components/EmployeeHeader';
import { useEmployee } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/employee.store';
import { useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';
import TaskList from '@/features/task/components/TaskList';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams();

  const setSelectedEmployee = useEmployeeStore((state) => state.setSelectedEmployee);

  const { data: employee, isLoading, isError } = useEmployee(employeeId ?? '');

  const { data: tasks = [], isLoading: isTasksLoading } = useTasks();

  const employeeTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === employeeId),
    [tasks, employeeId],
  );

  const stats = useMemo(() => getTaskStats(employeeTasks), [employeeTasks]);
  const completion = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  useEffect(() => {
    if (employee) {
      setSelectedEmployee(employee);
    }
  }, [employee, setSelectedEmployee]);

  if (!employeeId) {
    return <Navigate to="/admin/dashboard/employees" replace />;
  }

  if (isLoading || isTasksLoading) {
    return <CenteredState variant="loading" label="Loading employee..." />;
  }

  if (isError || !employee) {
    return <CenteredState variant="error" message="Employee details could not be loaded." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <BackButton to="/admin/dashboard/employees" label="Back to Employees" />

      <EmployeeHeader />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatsCard
          label="Assigned Tasks"
          value={stats.total}
          icon={<IconChecklist size={24} />}
          accent="var(--app-primary)"
        />
        <StatsCard
          label="Pending"
          value={stats.pending}
          icon={<IconClockHour4 size={24} />}
          accent="var(--app-warning)"
        />
        <StatsCard
          label="In Progress"
          value={stats.inProgress}
          icon={<IconProgress size={24} />}
          accent="var(--app-chart-in-progress)"
        />
        <StatsCard
          label="Completed"
          value={stats.completed}
          icon={<IconCircleCheck size={24} />}
          accent="var(--app-success)"
          hint={`${completion}% done`}
        />
      </SimpleGrid>

      <Card withBorder radius="lg">
        <Stack gap="md">
          <div>
            <Title order={4}>Employee Tasks</Title>
            <Text c="dimmed" size="sm">
              {employeeTasks.length} task{employeeTasks.length === 1 ? '' : 's'} assigned to{' '}
              {employee.fullName}
            </Text>
          </div>

          {employeeTasks.length === 0 ? (
            <CenteredState
              variant="empty"
              message={`No tasks assigned to ${employee.fullName} yet.`}
              minHeight={180}
            />
          ) : (
            <TaskList tasks={employeeTasks} readOnly />
          )}
        </Stack>
      </Card>
    </div>
  );
}
