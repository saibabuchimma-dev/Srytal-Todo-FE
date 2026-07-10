import { Button, Group, Modal, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import type { Project } from '../types/project';
import { useEffect } from 'react';

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
  mode?: 'create' | 'edit';
  project?: Project;
}

export default function ProjectModal({
  opened,
  onClose,
  mode = 'create',
  project,
}: ProjectModalProps) {
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
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
    reset({
      name: '',
      description: '',
      status: 'Planning',
      startDate: '',
      endDate: '',
    });
    onClose();
  };

  const onSubmit = (values: ProjectFormValues) => {
    if (mode === 'edit' && project) {
      updateProjectMutation.mutate(
        {
          projectId: project.id,
          payload: values,
        },
        {
          onSuccess: close,
        },
      );
      return;
    }
    createProjectMutation.mutate(values, {
      onSuccess: close,
    });
  };

  useEffect(() => {
    if (!opened) return;
    if (mode === 'edit' && project) {
      reset({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'Planning',
        startDate: '',
        endDate: '',
      });
    }
  }, [opened, mode, project, reset]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={mode === 'create' ? 'Create Project' : 'Edit Project'}
      centered
    >
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
            <Button
              type="submit"
              loading={
                mode === 'create'
                  ? createProjectMutation.isPending
                  : updateProjectMutation.isPending
              }
            >
              {mode === 'create' ? 'Create Project' : 'Update Project'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
