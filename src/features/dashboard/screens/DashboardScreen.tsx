import DashboardStats from '../components/DashboardStats';
import TaskList from '@/features/task/components/TaskList';
import EmployeeHeader from '@/features/employee/components/EmployeeHeader';

export default function DashboardScreen() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <EmployeeHeader />
      <DashboardStats />
      <TaskList />
    </div>
  );
}
