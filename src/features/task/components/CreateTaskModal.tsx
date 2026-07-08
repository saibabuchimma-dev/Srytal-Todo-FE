import { zodResolver } from '@hookform/resolvers/zod';
import { Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormModal from '@/components/common/FormModal';
import { useCreateTask } from '../hooks/useTasks';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useProjects } from '@/features/project';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  assignedTo: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  project: z.string().optional(),
  dueDate: z.date(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  opened: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ opened, onClose }: Props) {
  const createTask = useCreateTask();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: '',
      description: '',
      assignedTo: undefined,
      priority: 'Medium',
      status: 'Pending',
      project: undefined,
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

      <Controller
        control={control}
        name="project"
        render={({ field }) => (
          <Select
            label="Project"
            placeholder="Select project"
            searchable
            clearable
            disabled={projectsLoading}
            data={projects.map((project) => ({
              value: project.id,
              label: project.name,
            }))}
            value={field.value}
            onChange={(value) => field.onChange(value ?? undefined)}
          />
        )}
      />

      <Controller
        control={control}
        name="assignedTo"
        render={({ field }) => (
          <Select
            label="Assign Employee"
            placeholder="Select employee"
            searchable
            clearable
            disabled={employeesLoading}
            data={employees.map((employee) => ({
              value: employee.id,
              label: employee.fullName,
            }))}
            value={field.value}
            onChange={(value) => field.onChange(value ?? undefined)}
          />
        )}
      />

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
