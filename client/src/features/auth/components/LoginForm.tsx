import { Button, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import logo from '@/assets/logo/logo.png';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { toast } from '@/shared/utils/toast';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);
      loginStore(user);
      toast.success('Success', 'Login successful');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error && error.message !== 'Invalid email or password'
          ? error.message
          : 'Invalid email or password';

      toast.error('Login Failed', message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {/* Logo */}
        <div className="mb-6 ">
          <img src={logo} alt="Logo" className="h-28 w-full object-contain " />

          <Title order={2} mt="lg" ta="center">
            Welcome Back
          </Title>

          <Text ta="center" c="dimmed" size="sm" mt={5}>
            Sign in to your Employee Management Portal
          </Text>
        </div>

        {/* Username */}
        <TextInput
          label="Email"
          placeholder="Enter your Email"
          radius="md"
          size="md"
          leftSection={<HiOutlineEnvelope size={18} />}
          {...register('email')}
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          radius="md"
          size="md"
          leftSection={<HiOutlineLockClosed size={18} />}
          {...register('password')}
        />

        {/* Login Button */}
        <Button
          type="submit"
          size="md"
          radius="md"
          fullWidth
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}
          className="h-12"
        >
          Sign In
        </Button>

        <Text ta="center" size="xs" c="dimmed">
          © 2026 SRYTAL Employee Task Management System
        </Text>
      </Stack>
    </form>
  );
}
