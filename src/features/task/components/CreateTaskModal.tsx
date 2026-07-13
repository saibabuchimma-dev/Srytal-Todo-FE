import { zodResolver } from '@hookform/resolvers/zod';
import { Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormModal from '@/components/common/FormModal';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { useEmployees } from '@/features/employee/hooks/useEmployees';
import { useProjects } from '@/features/project';
import { useEffect } from 'react';
import type { Task } from '../types/task';

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
  projectId?: string;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  task?: Task;
}

export default function CreateTaskModal({
  opened,
  onClose,
  projectId,
  onSuccess,
  mode = 'create',
  task,
}: Props) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: undefined,
      priority: 'Medium',
      status: 'Pending',
      project: projectId,
      dueDate: new Date(),
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      dueDate: values.dueDate.toISOString(),
    };

    if (mode === 'edit' && task) {
      updateTask.mutate(
        {
          id: task.id,
          payload,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            close();
          },
        },
      );

      return;
    }

    createTask.mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
        close();
      },
    });
  };

  useEffect(() => {
    if (!opened) return;

    if (mode === 'edit' && task) {
      reset({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        status: task.status,
        project: task.project,
        dueDate: new Date(task.dueDate),
      });

      return;
    }

    reset({
      title: '',
      description: '',
      assignedTo: undefined,
      priority: 'Medium',
      status: 'Pending',
      project: projectId,
      dueDate: new Date(),
    });
  }, [opened, task, mode, projectId, reset]);

  return (
    <FormModal
      opened={opened}
      onClose={close}
      title={mode === 'create' ? 'Create Task' : 'Edit Task'}
      submitLabel={mode === 'create' ? 'Create' : 'Update'}
      loading={mode === 'create' ? createTask.isPending : updateTask.isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Task Title"
        error={errors.title?.message}
        placeholder="Enter task title"
        {...register('title')}
      />

      <Textarea
        label="Description"
        error={errors.description?.message}
        autosize
        minRows={4}
        placeholder="Enter task description"
        {...register('description')}
      />

      {!projectId && (
        <Controller
          control={control}
          name="project"
          render={({ field }) => (
            <Select
              label="Project"
              placeholder="Select project"
              error={errors.project?.message}
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
      )}

      <Controller
        control={control}
        name="assignedTo"
        render={({ field }) => (
          <Select
            label="Assign Employee"
            placeholder="Select employee"
            error={errors.assignedTo?.message}
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
            error={errors.priority?.message}
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
            error={errors.status?.message}
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
          <DateInput
            label="Due Date"
            error={errors.dueDate?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </FormModal>
  );
}
