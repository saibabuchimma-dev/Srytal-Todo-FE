import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  /** Explicit destination route. When omitted, navigates to the previous page. */
  to?: string;
  label?: string;
}

/**
 * Reusable "Back" navigation control. Defaults to browser-history back,
 * or navigates to an explicit route when `to` is provided.
 */
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
