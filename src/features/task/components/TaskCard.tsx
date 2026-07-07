import { ActionIcon, Badge, Card, Group, Menu, Stack, Text } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/config/routes';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const handleView = () => {
    const route =
      user?.role === 'Admin' ? ROUTES.ADMIN_TASK_DETAILS(task.id) : ROUTES.TASK_DETAILS(task.id);

    void navigate(route);
  };

  return (
    <motion.div whileHover={{ x: 3 }}>
      <Card withBorder radius="md" p="md" className="cursor-pointer" onClick={handleView}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text fw={600}>{task.title}</Text>

            <Text size="sm" c="dimmed">
              {task.description}
            </Text>

            <Group mt="xs">
              <Badge color="blue" variant="light">
                {task.status}
              </Badge>

              <Badge color="orange" variant="light">
                {task.priority}
              </Badge>
            </Group>
          </Stack>

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
                  onEdit(task);
                }}
              >
                Edit
              </Menu.Item>

              <Menu.Item
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>
    </motion.div>
  );
}
