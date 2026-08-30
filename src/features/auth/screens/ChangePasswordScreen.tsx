import { Button, Card, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { changePassword } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { toast } from '@/shared/utils/toast';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<ChangePasswordFormData>();

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data);
      updateUser({
        mustChangePassword: false,
      });
      toast.success('Password Updated', 'Your password has been updated successfully.');
      setTimeout(() => {
        navigate(user?.role === 'Admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to change password';
      toast.error('Password Change Failed', message);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: 'var(--app-bg)' }}
    >
      <Card className="w-full max-w-md" shadow="md" radius="lg">
        <Stack gap="md">
          <div>
            <Title order={2}>Change Your Password</Title>
            <Text c="dimmed" size="sm">
              You need to update your password before continuing to the dashboard.
            </Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <PasswordInput
                label="Current Password"
                placeholder="Enter your current password"
                leftSection={<HiOutlineLockClosed size={18} />}
                disabled={isSubmitting}
                {...register('currentPassword')}
              />
              <PasswordInput
                label="New Password"
                placeholder="Enter a new password"
                leftSection={<HiOutlineLockClosed size={18} />}
                disabled={isSubmitting}
                {...register('newPassword')}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your new password"
                leftSection={<HiOutlineLockClosed size={18} />}
                disabled={isSubmitting}
                {...register('confirmPassword')}
              />
              <Button type="submit" fullWidth loading={isSubmitting}>
                Update Password
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
}
