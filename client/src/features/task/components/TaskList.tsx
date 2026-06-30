import { Loader, Stack, Text } from '@mantine/core';

import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';

export default function TaskList() {
  const { data, isLoading } = useTasks();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Text fw={700} size="xl" mb="md">
        Today's Tasks
      </Text>

      <Stack>
        {data?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>
    </div>
  );
}
