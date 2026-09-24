import { Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconAlertTriangle,
  IconInbox,
  IconServerOff,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
    variant === 'error' ? (
      <IconAlertTriangle size={26} />
    ) : variant === 'empty' ? (
      <IconInbox size={26} />
    ) : (
      <IconServerOff size={26} />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
          >
            <ThemeIcon
              variant="light"
              radius="xl"
              size={64}
              color={variant === 'error' ? 'red' : 'gray'}
            >
              {icon ?? fallbackIcon}
            </ThemeIcon>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Title order={4} c="var(--app-text)" ta="center">
              {variant === 'error' ? 'Something went wrong' : 'No data to show'}
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              {message ??
                (variant === 'error'
                  ? 'Something went wrong. Please try again.'
                  : 'No data to show.')}
            </Text>
          </motion.div>
        </Stack>
      )}
    </motion.div>
  );
}
