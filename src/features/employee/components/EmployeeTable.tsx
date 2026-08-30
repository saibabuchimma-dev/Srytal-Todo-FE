import { ActionIcon, Avatar, Badge, Group, Menu, Table, Text } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { formatDate } from '@/shared/utils/date';
import type { Employee } from '../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const navigate = useNavigate();

  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th ta="center">Role</Table.Th>
            <Table.Th ta="center">Status</Table.Th>
            <Table.Th ta="center">Joined</Table.Th>
            <Table.Th w={56} />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {employees.map((employee) => (
            <Table.Tr
              key={employee.id}
              style={{ cursor: 'pointer' }}
              onClick={() => void navigate(ROUTES.EMPLOYEE_DETAILS(employee.id))}
            >
              <Table.Td>
                <Group gap="sm" wrap="nowrap">
                  <Avatar src={employee.avatar || undefined} radius="xl" size={38} color="blue">
                    {employee.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Text fw={600} size="sm" lineClamp={1}>
                      {employee.fullName}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {employee.email}
                    </Text>
                  </div>
                </Group>
              </Table.Td>

              <Table.Td ta="center">
                <Badge variant="light" color={employee.role === 'Admin' ? 'violet' : 'blue'}>
                  {employee.role}
                </Badge>
              </Table.Td>

              <Table.Td ta="center">
                <Badge variant="light" color={employee.isActive ? 'green' : 'orange'}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>

              <Table.Td ta="center">
                <Text size="sm" c="dimmed">
                  {employee.createdAt ? formatDate(employee.createdAt) : '—'}
                </Text>
              </Table.Td>

              <Table.Td onClick={(event) => event.stopPropagation()}>
                <Menu position="bottom-end" width={160} shadow="md" radius="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" aria-label="Actions">
                      <IconDotsVertical size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={16} />}
                      onClick={() => onEdit(employee)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={() => onDelete(employee)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
