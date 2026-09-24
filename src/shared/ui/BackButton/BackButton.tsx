import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
}

export default function BackButton({
  to,
  label = 'Back',
  onClick,
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
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
