import { Stack } from '@mantine/core';
import EmployeeCard from './EmployeeCard';
import type { Employee } from '../types/employee';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  return (
    <Stack gap="sm">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Stack>
  );
}
