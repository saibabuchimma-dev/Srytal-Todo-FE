import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import DashboardStats from '@/features/dashboard/components/DashboardStats';
import EmployeeHeader from '@/features/employee/components/EmployeeHeader';
import { useEmployee } from '@/features/employee/hooks/useEmployees';
import { useEmployeeStore } from '@/features/employee/store/employee.store';
import TaskList from '@/features/task/components/TaskList';
import Loader from '@/styles/loader';

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams();
  const parsedEmployeeId = Number(employeeId);
  const setSelectedEmployee = useEmployeeStore((state) => state.setSelectedEmployee);
  const { data: employee, isError, isLoading } = useEmployee(parsedEmployeeId);

  useEffect(() => {
    if (employee) {
      setSelectedEmployee(employee);
    }
  }, [employee, setSelectedEmployee]);

  if (!Number.isFinite(parsedEmployeeId)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return <Loader label="Loading employee details" size={44} />;
  }

  if (isError || !employee) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
        Employee details could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <EmployeeHeader />
      <DashboardStats />
      <TaskList />
    </div>
  );
}
