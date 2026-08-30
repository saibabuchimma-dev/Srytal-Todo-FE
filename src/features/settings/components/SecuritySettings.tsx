import { Button, Card, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';

import { changePassword } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/utils/toast';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormData>();

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await changePassword(data);
      updateUser({ mustChangePassword: false });
      toast.success('Password updated');
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to change password.');
    }
  };

  return (
    <Card withBorder radius="md" p="lg" maw={520}>
      <Stack>
        <div>
          <Title order={5}>Change password</Title>
          <Text size="sm" c="dimmed">
            Use a strong password with at least 8 characters.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <PasswordInput
              label="Current password"
              disabled={isSubmitting}
              {...register('currentPassword')}
            />
            <PasswordInput
              label="New password"
              disabled={isSubmitting}
              {...register('newPassword')}
            />
            <PasswordInput
              label="Confirm new password"
              disabled={isSubmitting}
              {...register('confirmPassword')}
            />
            <Button type="submit" loading={isSubmitting}>
              Update password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
