import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Menu,
  Table,
  Text,
} from '@mantine/core';
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

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const navigate = useNavigate();

  return (
    <Table.ScrollContainer minWidth={640}>
      <Table
        verticalSpacing="sm"
        horizontalSpacing="md"
        highlightOnHover
        styles={{
          table: {
            borderColor: 'var(--app-border)',
            backgroundColor: 'var(--app-surface)',
          },
          thead: {
            backgroundColor: 'var(--app-surface-2)',
            borderBottom: '1px solid var(--app-border)',
          },
          th: {
            color: 'var(--app-text-muted)',
            fontWeight: 700,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            paddingTop: 12,
            paddingBottom: 12,
          },
          td: {
            borderColor: 'var(--app-border)',
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ paddingLeft: 16 }}>Employee</Table.Th>
            <Table.Th ta="center">Role</Table.Th>
            <Table.Th ta="center">Status</Table.Th>
            <Table.Th ta="center">Joined</Table.Th>
            <Table.Th w={56} style={{ paddingRight: 16 }} ta="right">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {employees.map((employee) => (
            <Table.Tr
              key={employee.id}
              style={{
                cursor: 'pointer',
                transition: 'background-color 140ms ease',
              }}
              className="hover:bg-[var(--app-surface-hover)]"
              onClick={() =>
                void navigate(ROUTES.EMPLOYEE_DETAILS(employee.id))
              }
            >
              <Table.Td style={{ paddingLeft: 16 }}>
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={employee.avatar || undefined}
                    radius="xl"
                    size={36}
                    color="indigo"
                  >
                    {employee.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Text fw={600} size="sm" lineClamp={1} c="var(--app-text)">
                      {employee.fullName}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {employee.email}
                    </Text>
                  </div>
                </Group>
              </Table.Td>

              <Table.Td ta="center">
                <Badge
                  variant="light"
                  color={employee.role === 'Admin' ? 'indigo' : 'teal'}
                  size="sm"
                >
                  {employee.role}
                </Badge>
              </Table.Td>

              <Table.Td ta="center">
                <Badge
                  variant="outline"
                  color={employee.isActive ? 'teal' : 'gray'}
                  size="sm"
                >
                  {employee.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>

              <Table.Td ta="center">
                <Text size="xs" c="dimmed">
                  {employee.createdAt ? formatDate(employee.createdAt) : '—'}
                </Text>
              </Table.Td>

              <Table.Td
                onClick={(event) => event.stopPropagation()}
                style={{ paddingRight: 16 }}
                ta="right"
              >
                <Menu position="bottom-end" width={150} shadow="md" radius="md">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label="Actions"
                      size="sm"
                    >
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={() => onEdit(employee)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
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
