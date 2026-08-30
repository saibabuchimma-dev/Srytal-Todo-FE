import { Select, TextInput, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFolderPlus } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import type { Project } from '../types/project';
import { useEffect } from 'react';
import FormModal from '@/components/common/FormModal';
import { toDateInputValue } from '@/shared/utils/date';

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
    <FormModal
      opened={opened}
      onClose={close}
      icon={<IconFolderPlus size={20} />}
      title={mode === 'create' ? 'Create Project' : 'Edit Project'}
      subtitle={
        mode === 'create'
          ? 'Set up a new project and timeline.'
          : 'Update this project’s details.'
      }
      submitLabel={mode === 'create' ? 'Create Project' : 'Update Project'}
      loading={
        mode === 'create' ? createProjectMutation.isPending : updateProjectMutation.isPending
      }
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput label="Project Name" {...register('name')} />
      <Textarea label="Description" minRows={3} autosize {...register('description')} />
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
          <DatePickerInput
            label="Start Date"
            placeholder="Pick a start date"
            valueFormat="DD MMM YYYY"
            value={toDateInputValue(field.value) || null}
            onChange={(value) => field.onChange(value ?? '')}
          />
        )}
      />
      <Controller
        control={control}
        name="endDate"
        render={({ field }) => (
          <DatePickerInput
            label="End Date"
            placeholder="Pick an end date"
            valueFormat="DD MMM YYYY"
            value={toDateInputValue(field.value) || null}
            onChange={(value) => field.onChange(value ?? '')}
          />
        )}
      />
    </FormModal>
  );
}
