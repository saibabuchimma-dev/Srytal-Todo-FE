import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import Loader from '@/styles/loader';

type StateVariant = 'loading' | 'empty' | 'error';

interface CenteredStateProps {
  variant?: StateVariant;
  /** Loader label (loading) or the message text (empty/error). */
  message?: string;
  label?: string;
  icon?: ReactNode;
  /** Vertical space the state occupies; centered within it. */
  minHeight?: number | string;
  size?: number;
}

/**
 * Reusable, perfectly-centered container for page loading / empty / error
 * states. Keeps spinners and "no data" messages centered instead of pinned
 * to the top-left of the content area.
 */
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
