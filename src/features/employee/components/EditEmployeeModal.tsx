import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, TextInput } from '@mantine/core';
import { IconUserEdit } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormModal from '@/components/common/FormModal';
import { useUpdateEmployee } from '../hooks/useEmployees';
import type { Employee } from '../types/employee';

const employeeSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum(['Admin', 'Employee']),
  isActive: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeModalProps {
  opened: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export default function EditEmployeeModal({ opened, employee, onClose }: EditEmployeeModalProps) {
  const updateEmployeeMutation = useUpdateEmployee();

  const { control, register, handleSubmit, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'Employee',
      isActive: true,
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
        isActive: employee.isActive,
      });
    }
  }, [employee, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: EmployeeFormValues) => {
    if (!employee) return;

    updateEmployeeMutation.mutate(
      {
        id: employee.id,
        payload: values,
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
      icon={<IconUserEdit size={20} />}
      title="Edit Employee"
      subtitle="Update this team member’s details."
      loading={updateEmployeeMutation.isPending}
      submitLabel="Update"
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
