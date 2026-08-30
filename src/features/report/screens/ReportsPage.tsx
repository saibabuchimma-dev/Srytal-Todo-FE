import { Card, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { useReportOverview } from '../hooks/useReport';
import ChartCard from '../components/ChartCard';
import StatusPieChart from '../components/StatusPieChart';
import PriorityBarChart from '../components/PriorityBarChart';
import MonthlyTasksChart from '../components/MonthlyTasksChart';

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Title order={2} mt={4}>
        {value}
      </Title>
    </Card>
  );
}

export default function ReportsPage() {
  const { data, isLoading, isError } = useReportOverview();

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading analytics..." />;
  }

  if (isError || !data) {
    return <CenteredState variant="error" message="Analytics could not be loaded." />;
  }

  const { totals, statusDistribution, priorityDistribution, monthlyTasks } = data;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>Reports &amp; Analytics</Title>
            <Text c="dimmed">Task and workforce insights at a glance.</Text>
          </div>

          <div
            className="rounded-full p-3"
            style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
          >
            <IconChartBar size={24} />
          </div>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <StatTile label="Total Tasks" value={totals.totalTasks} />
        <StatTile label="Completed" value={totals.completed} />
        <StatTile label="Completion Rate" value={`${totals.completionRate}%`} />
        <StatTile label="Total Employees" value={totals.totalEmployees} />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <ChartCard title="Task Status" subtitle="Distribution across statuses">
          <StatusPieChart data={statusDistribution} />
        </ChartCard>

        <ChartCard title="Task Priority" subtitle="Number of tasks by priority">
          <PriorityBarChart data={priorityDistribution} />
        </ChartCard>
      </SimpleGrid>

      <ChartCard title="Monthly Tasks" subtitle="Tasks created over the last 6 months">
        <MonthlyTasksChart data={monthlyTasks} />
      </ChartCard>
    </div>
  );
}
