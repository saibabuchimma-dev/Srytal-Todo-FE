import {
  Badge,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/logo/logo1.png';
import { login } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { toast } from '@/shared/utils/toast';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  portal: 'admin' | 'employee';
}

export default function LoginForm({ portal }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const expectedRole = portal === 'admin' ? 'Admin' : 'Employee';

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);

      if (user.role !== expectedRole) {
        toast.error(
          'Wrong Portal',
          'You are trying to login from the wrong portal.',
        );
        return;
      }

      loginStore(user, user.token);

      if (user.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }

      toast.success('Success', 'Login successful');
      navigate(portal === 'admin' ? '/admin/dashboard' : '/dashboard', {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message !== 'Invalid email or password'
          ? error.message
          : 'Invalid email or password';

      toast.error('Login Failed', message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
        borderRadius: 20,
        padding: '36px 32px',
        boxShadow: 'var(--app-shadow-card-hover)',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="lg">
          <Stack gap={8} align="center">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img
                src={logo}
                alt="SRYTAL"
                style={{ height: 68, objectFit: 'contain', borderRadius: 12 }}
              />
            </div>

            <Badge
              variant="light"
              color={portal === 'admin' ? 'indigo' : 'teal'}
              radius="sm"
              size="sm"
              tt="uppercase"
              fw={700}
            >
              {portal === 'admin' ? 'Admin Portal' : 'Employee Portal'}
            </Badge>

            <Title order={2} ta="center" fw={800} lh={1.2} mt={4}>
              Welcome back
            </Title>

            <Text ta="center" c="dimmed" size="xs">
              Sign in to continue to your{' '}
              {portal === 'admin' ? 'administrator' : 'team member'} workspace
            </Text>
          </Stack>

          <Stack gap="sm">
            <TextInput
              label="Work Email"
              placeholder="name@company.com"
              radius="md"
              size="sm"
              autoComplete="email"
              leftSection={<HiOutlineEnvelope size={16} />}
              disabled={isSubmitting}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              radius="md"
              size="sm"
              autoComplete="current-password"
              leftSection={<HiOutlineLockClosed size={16} />}
              disabled={isSubmitting}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          </Stack>

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            h={44}
            loading={isSubmitting}
            styles={{
              root: {
                border: 'none',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              },
            }}
          >
            Sign In
          </Button>

          <Text ta="center" size="xs" c="dimmed">
            Trouble signing in? Contact your system administrator.
          </Text>
        </Stack>
      </form>
    </div>
  );
}
