import { Button, Drawer, Group, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from 'react-hook-form';

interface Props {
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date | null | string;
}

export default function AddTaskDrawer({ opened, onClose }: Props) {
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Create Task" position="right" size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Task Title" {...register('title')} />

          <Textarea label="Description" minRows={4} {...register('description')} />

          <Select
            label="Priority"
            data={['High', 'Medium', 'Low']}
            onChange={(value) => setValue('priority', value || '')}
          />

          <Select
            label="Status"
            data={['Pending', 'In Progress', 'Completed']}
            onChange={(value) => setValue('status', value || '')}
          />

          <DateInput
            label="Due Date"
            valueFormat="DD MMM YYYY"
            onChange={(value) => setValue('dueDate', value)}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">Create Task</Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
