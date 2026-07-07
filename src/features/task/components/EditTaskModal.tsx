import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { DateInput } from '@mantine/dates';
import { Select, Textarea, TextInput } from '@mantine/core';
import FormModal from '@/components/common/FormModal';
import { useUpdateTask } from '../hooks/useTasks';
import type { Task } from '../types/task';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  assignedTo: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  opened: boolean;
  task: Task | null;
  onClose: () => void;
}

export default function EditTaskModal({ opened, task, onClose }: Props) {
  const updateTask = useUpdateTask();

  const { control, register, reset, handleSubmit } = useForm<FormValues>({
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

  useEffect(() => {
    if (!task) return;

    reset({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
    });
  }, [task, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    if (!task) return;

    updateTask.mutate(
      {
        id: task.id,
        payload: {
          ...values,
          dueDate: values.dueDate.toISOString(),
        },
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
      title="Edit Task"
      submitLabel="Update"
      loading={updateTask.isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput label="Task Title" {...register('title')} />

      <Textarea label="Description" autosize minRows={4} {...register('description')} />

      <TextInput label="Employee Id" {...register('assignedTo')} />

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
