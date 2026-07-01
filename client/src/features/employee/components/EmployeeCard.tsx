import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useEmployeeStore } from '../store/employee.store';
import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  taskCount: number;
}

export default function EmployeeCard({ employee, taskCount }: EmployeeCardProps) {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const navigate = useNavigate();
  const isSelected = selectedEmployee?.id === employee.id;

  const handleSelectEmployee = () => {
    setSelectedEmployee(employee);
    void navigate(ROUTES.EMPLOYEE_DETAILS(employee.id));
  };

  return (
    <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
      <Card
        withBorder
        radius="md"
        p="md"
        onClick={handleSelectEmployee}
        className={`
          cursor-pointer
          transition-all
          duration-300
          hover:shadow-md
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
        `}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <Avatar src={employee.avatar} radius="xl" />

            <Stack gap={2}>
              <Text fw={600} lineClamp={1}>
                {employee.name}
              </Text>

              <Text size="xs" c="dimmed" lineClamp={1}>
                {employee.designation}
              </Text>
            </Stack>
          </Group>

          <Badge color="indigo" variant="light">
            {taskCount}
          </Badge>
        </Group>
      </Card>
    </motion.div>
  );
}
