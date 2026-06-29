import { Group, Title, ActionIcon, Avatar } from '@mantine/core';
import { HiOutlineBell, HiOutlineMoon } from 'react-icons/hi2';

export default function Header() {
  return (
    <header className="flex h-full items-center justify-between px-6 bg-white border-b border-slate-200">
      <Title order={3}>SRYTAL Task Manager</Title>

      <Group>
        <ActionIcon variant="light" size="lg">
          <HiOutlineBell size={20} />
        </ActionIcon>

        <ActionIcon variant="light" size="lg">
          <HiOutlineMoon size={20} />
        </ActionIcon>

        <Avatar color="blue" radius="xl">
          S
        </Avatar>
      </Group>
    </header>
  );
}
