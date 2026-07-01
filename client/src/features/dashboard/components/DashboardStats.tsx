import { SimpleGrid, Skeleton } from '@mantine/core';

import StatsCard from './StatsCard';

import { useEmployeeStore } from '@/features/employee/store/employee.store';
import { useTasks } from '@/features/task/hooks/useTasks';
import { getTaskStats } from '@/features/task/utils/task.utils';

export default function DashboardStats() {
  const selectedEmployee = useEmployeeStore((state) => state.selectedEmployee);
  const { data = [], isLoading } = useTasks(
    selectedEmployee ? { employeeId: selectedEmployee.id } : {},
  );
  const stats = getTaskStats(selectedEmployee ? data : []);

  if (isLoading && selectedEmployee) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={96} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
      <StatsCard title="Pending" value={stats.pending} />
      <StatsCard title="In Progress" value={stats.inProgress} />
      <StatsCard title="Completed" value={stats.completed} />
      <StatsCard title="Total Tasks" value={stats.total} />
    </SimpleGrid>
  );
}
