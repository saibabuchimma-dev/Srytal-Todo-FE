import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateEmployee } from '../hooks/useEmployees';

const employeeSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum(['Admin', 'Employee']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isActive: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface CreateEmployeeModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({ opened, onClose }: CreateEmployeeModalProps) {
  const createEmployeeMutation = useCreateEmployee();
  const { control, handleSubmit, register, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'Employee',
      password: '',
      isActive: true,
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: EmployeeFormValues) => {
    createEmployeeMutation.mutate(values, { onSuccess: close });
  };

  return (
    <Modal opened={opened} onClose={close} title="Create Employee" centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput label="Full Name" {...register('fullName')} />
          <TextInput label="Email" {...register('email')} />
          <TextInput label="Temporary Password" type="password" {...register('password')} />
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                label="Role"
                data={['Admin', 'Employee']}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={createEmployeeMutation.isPending}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
