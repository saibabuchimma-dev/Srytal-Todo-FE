import { Stack } from '@mantine/core';
import EmployeeCard from './EmployeeCard';
import type { Employee } from '../types/employee';

interface EmployeeListProps {
  employees: Employee[];
  taskCounts: Record<string, number>;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeList({
  employees,
  taskCounts,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  return (
    <Stack gap="sm">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          taskCount={taskCounts[employee.id] ?? 0}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
