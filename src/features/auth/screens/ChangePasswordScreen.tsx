import {
  Box,
  Button,
  Card,
  PasswordInput,
  Stack,
  Text,
  Title,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { IconShieldCheck } from '@tabler/icons-react';
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
      toast.success(
        'Password Updated',
        'Your password has been updated successfully.',
      );
      setTimeout(() => {
        navigate(user?.role === 'Admin' ? '/admin/dashboard' : '/dashboard', {
          replace: true,
        });
      }, 800);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to change password';
      toast.error('Password Change Failed', message);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <Card
        className="w-full max-w-md"
        radius="lg"
        p="xl"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card-hover)',
          borderRadius: 20,
        }}
      >
        <Stack gap="lg">
          <Box style={{ textAlign: 'center' }}>
            <ThemeIcon
              size={48}
              radius="xl"
              variant="light"
              color="indigo"
              style={{ margin: '0 auto 12px' }}
            >
              <IconShieldCheck size={26} />
            </ThemeIcon>
            <Title order={2} fw={800} fz={22}>
              Update Temporary Password
            </Title>
            <Text c="dimmed" size="xs" mt={4}>
              For security, please set a new personal password before entering
              the workspace.
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <PasswordInput
                label="Current Password"
                placeholder="Enter your current password"
                radius="md"
                size="sm"
                leftSection={<HiOutlineLockClosed size={16} />}
                disabled={isSubmitting}
                {...register('currentPassword', { required: true })}
              />
              <PasswordInput
                label="New Password"
                placeholder="At least 6 characters"
                radius="md"
                size="sm"
                leftSection={<HiOutlineLockClosed size={16} />}
                disabled={isSubmitting}
                {...register('newPassword', { required: true, minLength: 6 })}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your new password"
                radius="md"
                size="sm"
                leftSection={<HiOutlineLockClosed size={16} />}
                disabled={isSubmitting}
                {...register('confirmPassword', { required: true })}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                h={44}
                loading={isSubmitting}
                style={{
                  background: 'var(--app-brand-gradient)',
                  color: 'var(--app-brand-on)',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Update Password &amp; Continue
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
}
