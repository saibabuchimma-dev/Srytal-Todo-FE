import { SimpleGrid } from '@mantine/core';

import StatsCard from './StatsCard';

export default function DashboardStats() {
  return (
    <SimpleGrid cols={4}>
      <StatsCard title="Pending" value={5} />
      <StatsCard title="In Progress" value={3} />
      <StatsCard title="Completed" value={12} />
      <StatsCard title="Total Tasks" value={20} />
    </SimpleGrid>
  );
}
