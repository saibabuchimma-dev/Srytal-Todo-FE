import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      void navigate(to);
    } else {
      void navigate(-1);
    }
  };

  return (
    <Button
      variant="subtle"
      color="gray"
      leftSection={<IconArrowLeft size={16} />}
      onClick={handleClick}
      style={{ alignSelf: 'flex-start' }}
      px="xs"
    >
      {label}
    </Button>
  );
}
