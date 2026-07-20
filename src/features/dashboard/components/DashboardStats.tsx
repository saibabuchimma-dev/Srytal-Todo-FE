import { SimpleGrid, Skeleton } from '@mantine/core';
import StatsCard from './StatsCard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useMyTasks, useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';

export default function DashboardStats() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const employeesQuery = useEmployees({
    enabled: isAdmin,
  });

  const adminTasksQuery = useTasks({
    enabled: isAdmin,
  });

  const myTasksQuery = useMyTasks({
    enabled: !isAdmin,
  });

  const employees = employeesQuery.data ?? [];
  const tasks = isAdmin ? (adminTasksQuery.data ?? []) : (myTasksQuery.data ?? []);
  const isEmployeesLoading = employeesQuery.isLoading;
  const isTasksLoading = isAdmin ? adminTasksQuery.isLoading : myTasksQuery.isLoading;
  const stats = getTaskStats(tasks);

  if (isTasksLoading || isEmployeesLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={96} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  if (isAdmin) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        <StatsCard title="Total Employees" value={employees.length} />
        <StatsCard
          title="Active Employees"
          value={employees.filter((employee) => employee.isActive !== false).length}
        />
        <StatsCard title="Total Tasks" value={stats.total} />
        <StatsCard title="Completed Tasks" value={stats.completed} />
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
      <StatsCard title="Assigned Tasks" value={stats.total} />
      <StatsCard title="Pending" value={stats.pending} />
      <StatsCard title="In Progress" value={stats.inProgress} />
      <StatsCard title="Completed" value={stats.completed} />
    </SimpleGrid>
  );
}
