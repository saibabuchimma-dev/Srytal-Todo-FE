import { SimpleGrid, Skeleton } from '@mantine/core';
import {
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconProgress,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import StatsCard from './StatsCard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useMyTasks, useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';

export default function DashboardStats() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const employeesQuery = useEmployees({ enabled: isAdmin });
  const adminTasksQuery = useTasks({ enabled: isAdmin });
  const myTasksQuery = useMyTasks({ enabled: !isAdmin });

  const employees = employeesQuery.data ?? [];
  const tasks = isAdmin ? (adminTasksQuery.data ?? []) : (myTasksQuery.data ?? []);
  const isEmployeesLoading = isAdmin && employeesQuery.isLoading;
  const isTasksLoading = isAdmin ? adminTasksQuery.isLoading : myTasksQuery.isLoading;
  const stats = getTaskStats(tasks);

  if (isTasksLoading || isEmployeesLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={108} radius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  if (isAdmin) {
    const activeEmployees = employees.filter((employee) => employee.isActive !== false).length;

    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatsCard
          label="Total Employees"
          value={employees.length}
          icon={<IconUsers size={24} />}
          accent="var(--app-primary)"
        />
        <StatsCard
          label="Active Employees"
          value={activeEmployees}
          icon={<IconUserCheck size={24} />}
          accent="var(--app-success)"
          hint={`${employees.length - activeEmployees} inactive`}
        />
        <StatsCard
          label="Total Tasks"
          value={stats.total}
          icon={<IconChecklist size={24} />}
          accent="var(--app-accent)"
        />
        <StatsCard
          label="Completed"
          value={stats.completed}
          icon={<IconCircleCheck size={24} />}
          accent="var(--app-success)"
          hint={`${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}% done`}
        />
      </SimpleGrid>
    );
  }

  return (
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
      />
    </SimpleGrid>
  );
}
