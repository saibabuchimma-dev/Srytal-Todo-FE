import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <Button
      leftSection={<IconPlus size={18} />}
      radius="md"
      onClick={onClick}
      variant="gradient"
      gradient={{ from: 'blue', to: 'indigo' }}
    >
      Add Task
    </Button>
  );
}
