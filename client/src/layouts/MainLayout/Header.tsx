import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/auth.store';

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Group justify="flex-end" p="md">
      <Button color="red" onClick={handleLogout}>
        Logout
      </Button>
    </Group>
  );
}
