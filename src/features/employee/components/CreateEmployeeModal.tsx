import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextInput } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormModal from '@/components/common/FormModal';
import { useCreateEmployee } from '../hooks/useEmployees';

const employeeSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum(['Admin', 'Employee']),
  isActive: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface CreateEmployeeModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({ opened, onClose }: CreateEmployeeModalProps) {
  const createEmployeeMutation = useCreateEmployee();
  const { control, register, handleSubmit, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'Employee',
      isActive: true,
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: EmployeeFormValues) => {
    createEmployeeMutation.mutate(values, {
      onSuccess: close,
    });
  };

  return (
    <FormModal
      opened={opened}
      onClose={close}
      icon={<IconUserPlus size={20} />}
      title="Create Employee"
      subtitle="Add a new team member to your workspace."
      loading={createEmployeeMutation.isPending}
      submitLabel="Create"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput label="Full Name" placeholder="Enter full name" {...register('fullName')} />

      <TextInput label="Email" placeholder="Enter email" {...register('email')} />

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Select
            label="Role"
            data={['Admin', 'Employee']}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </FormModal>
  );
}
