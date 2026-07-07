import { zodResolver } from '@hookform/resolvers/zod';
import { Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormModal from '@/components/common/FormModal';
import { useCreateTask } from '../hooks/useTasks';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  assignedTo: z.string().min(1, 'Employee is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  dueDate: z.date(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  opened: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ opened, onClose }: Props) {
  const createTask = useCreateTask();

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date(),
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    createTask.mutate(
      {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
      {
        onSuccess: close,
      },
    );
  };

  return (
    <FormModal
      opened={opened}
      onClose={close}
      title="Create Task"
      submitLabel="Create"
      loading={createTask.isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput label="Task Title" placeholder="Enter task title" {...register('title')} />

      <Textarea
        label="Description"
        autosize
        minRows={4}
        placeholder="Enter task description"
        {...register('description')}
      />

      <TextInput label="Employee Id" placeholder="Enter employee id" {...register('assignedTo')} />

      <Controller
        control={control}
        name="priority"
        render={({ field }) => (
          <Select
            label="Priority"
            data={['Low', 'Medium', 'High']}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            label="Status"
            data={['Pending', 'In Progress', 'Completed']}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="dueDate"
        render={({ field }) => (
          <DateInput label="Due Date" value={field.value} onChange={field.onChange} />
        )}
      />
    </FormModal>
  );
}
