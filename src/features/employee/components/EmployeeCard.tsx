import { ActionIcon, Avatar, Badge, Card, Group, Menu, Stack, Text } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useEmployeeStore } from '../store/employee.store';
import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  taskCount: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, taskCount, onEdit, onDelete }: EmployeeCardProps) {
  const navigate = useNavigate();

  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();

  const isSelected = selectedEmployee?.id === employee.id;

  const handleView = () => {
    setSelectedEmployee(employee);
    void navigate(ROUTES.EMPLOYEE_DETAILS(employee.id));
  };

  return (
    <motion.div whileHover={{ x: 3 }}>
      <Card
        withBorder
        radius="md"
        p="md"
        className={`cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : ''
        }`}
        onClick={handleView}
      >
        <Group justify="space-between">
          <Group>
            <Avatar src={employee.avatar} radius="xl" />

            <Stack gap={2}>
              <Text fw={600}>{employee.fullName}</Text>

              <Text size="sm" c="dimmed">
                {employee.email}
              </Text>
            </Stack>
          </Group>

          <Group>
            <Badge variant="light">{employee.role}</Badge>

            <Badge color="indigo">{taskCount}</Badge>

            <Menu shadow="md" width={180}>
              <Menu.Target>
                <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(employee);
                  }}
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(employee);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Card>
    </motion.div>
  );
}
