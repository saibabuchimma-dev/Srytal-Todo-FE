import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '@/features/task/constants/task.constants';
import { useCreateTask, useUpdateTask } from '@/features/task/hooks/useTasks';
import type { Task, TaskFormValues } from '@/features/task/types/task';
import { taskSchema } from '@/features/task/validation/task.schema';

interface TaskDrawerProps {
  employeeId: number | null;
  task: Task | null;
  opened: boolean;
  onClose: () => void;
}

const getDefaultValues = (task: Task | null): TaskFormValues => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  priority: task?.priority ?? 'Medium',
  status: task?.status ?? 'Pending',
  dueDate: task?.dueDate ?? dayjs().add(1, 'day').format('YYYY-MM-DD'),
});

export default function TaskDrawer({ employeeId, task, opened, onClose }: TaskDrawerProps) {
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const isEditMode = task !== null;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    values: getDefaultValues(task),
  });

  const handleClose = () => {
    reset(getDefaultValues(null));
    onClose();
  };

  const onSubmit = (values: TaskFormValues) => {
    const timestamp = new Date().toISOString();

    if (isEditMode) {
      updateTaskMutation.mutate(
        {
          taskId: task.id,
          payload: {
            ...values,
            updatedAt: timestamp,
          },
        },
        {
          onSuccess: handleClose,
        },
      );

      return;
    }

    if (employeeId === null) {
      return;
    }

    createTaskMutation.mutate(
      {
        ...values,
        employeeId,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        onSuccess: handleClose,
      },
    );
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={isEditMode ? 'Edit Task' : 'Create Task'}
      position="right"
      size="lg"
      radius="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Task Title"
            placeholder="Enter task title"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Description"
            placeholder="Describe the work clearly"
            minRows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select
                label="Priority"
                data={TASK_PRIORITY_OPTIONS}
                error={errors.priority?.message}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                data={TASK_STATUS_OPTIONS}
                error={errors.status?.message}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DateInput
                label="Due Date"
                valueFormat="DD MMM YYYY"
                clearable={false}
                error={errors.dueDate?.message}
                value={field.value ? dayjs(field.value).toDate() : null}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value ? dayjs(value).format('YYYY-MM-DD') : '')}
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              loading={createTaskMutation.isPending || updateTaskMutation.isPending}
              disabled={!isEditMode && employeeId === null}
            >
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
