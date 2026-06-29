import { Stack } from '@mantine/core';

import EmployeeCard from './EmployeeCard';
import type { Employee } from '../types/employee';

interface EmployeeListProps {
  employees: Employee[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  return (
    <Stack gap="sm">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onClick={() => console.log(employee.id)}
        />
      ))}
    </Stack>
  );
}
