import { Button, Group, Modal, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject } from '../hooks/useProjects';

const toDateValue = (value: string) => (value ? new Date(value) : null);
const toInputValue = (value: Date | string | null) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString().slice(0, 10);
};

const projectSchema = z.object({
  name: z.string().trim().min(3, 'Name is required'),
  description: z.string().trim().min(8, 'Description is required'),
  status: z.enum(['Planning', 'In Progress', 'Completed']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ProjectModal({ opened, onClose }: ProjectModalProps) {
  const createProjectMutation = useCreateProject();
  const { control, handleSubmit, register, reset } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Planning',
      startDate: '',
      endDate: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: ProjectFormValues) => {
    createProjectMutation.mutate(values, { onSuccess: close });
  };

  return (
    <Modal opened={opened} onClose={close} title="Create Project" centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput label="Project Name" {...register('name')} />
          <Textarea label="Description" minRows={3} {...register('description')} />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                data={['Planning', 'In Progress', 'Completed']}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DateInput
                label="Start Date"
                valueFormat="DD MMM YYYY"
                value={toDateValue(field.value)}
                onChange={(value) => field.onChange(toInputValue(value))}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DateInput
                label="End Date"
                valueFormat="DD MMM YYYY"
                value={toDateValue(field.value)}
                onChange={(value) => field.onChange(toInputValue(value))}
              />
            )}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={createProjectMutation.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
