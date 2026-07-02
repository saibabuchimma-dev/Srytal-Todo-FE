import { Alert, ScrollArea, Text } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';

import { useEmployees } from '@/features/employee/hooks/useEmployees';
import EmployeeSearch from '@/features/employee/components/EmployeeSearch';
import EmployeeList from '@/features/employee/components/EmployeeList';
import { useEmployeeStore } from '@/features/employee/store/employee.store';
import { useTasks } from '@/features/task/hooks/useTasks';
import Loader from '@/styles/loader';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const { data = [], isLoading } = useEmployees();
  const { data: tasks = [] } = useTasks();
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return data.filter(
      (employee) =>
        employee.name.toLowerCase().includes(normalizedSearch) ||
        employee.designation.toLowerCase().includes(normalizedSearch),
    );
  }, [data, search]);

  const taskCounts = useMemo(
    () =>
      tasks.reduce<Record<number, number>>((counts, task) => {
        counts[task.employeeId] = (counts[task.employeeId] ?? 0) + 1;

        return counts;
      }, {}),
    [tasks],
  );

  useEffect(() => {
    if (selectedEmployee === null && data.length > 0) {
      setSelectedEmployee(data[0]);
    }
  }, [data, selectedEmployee, setSelectedEmployee]);

  return (
    <ScrollArea className="h-full bg-slate-50">
      <div className="p-4">
        <Text fw={700} size="lg" mb="md">
          Employees
        </Text>

        <EmployeeSearch value={search} onChange={setSearch} />

        <div className="mt-4">
          {isLoading ? (
            <div className="h-32">
              <Loader label="Loading employees" size={34} />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <Alert color="gray" radius="md">
              No employees match your search.
            </Alert>
          ) : (
            <EmployeeList employees={filteredEmployees} taskCounts={taskCounts} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
