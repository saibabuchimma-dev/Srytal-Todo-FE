import { Loader, ScrollArea, Text } from '@mantine/core';

import { useEmployees } from '@/features/employee/hooks/useEmployees';
import EmployeeSearch from '@/features/employee/components/EmployeeSearch';
import EmployeeList from '@/features/employee/components/EmployeeList';

export default function Sidebar() {
  const { data = [], isLoading } = useEmployees();

  return (
    <ScrollArea className="h-full bg-slate-50">
      <div className="p-4">
        <Text fw={700} size="lg" mb="md">
          Employees
        </Text>

        <EmployeeSearch />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <EmployeeList employees={data} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
