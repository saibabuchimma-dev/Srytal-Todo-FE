import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import Loader from '@/styles/loader';

type StateVariant = 'loading' | 'empty' | 'error';

interface CenteredStateProps {
  variant?: StateVariant;
  message?: string;
  label?: string;
  icon?: ReactNode;
  minHeight?: number | string;
  size?: number;
}

export default function CenteredState({
  variant = 'loading',
  message,
  label = 'Loading',
  icon,
  minHeight = '60vh',
  size = 44,
}: CenteredStateProps) {
  const fallbackIcon =
    variant === 'error' ? <IconAlertTriangle size={26} /> : <IconInbox size={26} />;

  return (
    <div
      style={{
        minHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {variant === 'loading' ? (
        <Loader label={label} size={size} />
      ) : (
        <Stack align="center" gap="sm" maw={360} px="md">
          <ThemeIcon
            variant="light"
            radius="xl"
            size={54}
            color={variant === 'error' ? 'red' : 'gray'}
          >
            {icon ?? fallbackIcon}
          </ThemeIcon>
          <Text c="dimmed" ta="center">
            {message ?? (variant === 'error' ? 'Something went wrong.' : 'No data to show.')}
          </Text>
        </Stack>
      )}
    </div>
  );
}
