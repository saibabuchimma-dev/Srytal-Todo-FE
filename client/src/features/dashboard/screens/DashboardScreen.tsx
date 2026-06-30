import { Paper } from '@mantine/core';
import EmployeeHeader from '@/features/employee/components/EmployeeHeader';

export default function DashboardScreen() {
  return (
    <Paper radius="lg" p="xl">
      <EmployeeHeader />
    </Paper>
  );
}
