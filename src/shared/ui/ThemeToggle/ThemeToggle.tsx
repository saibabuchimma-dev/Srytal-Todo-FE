import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  size?: number;
  chip?: boolean;
}

export default function ThemeToggle({
  size = 40,
  chip = false,
}: ThemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant={chip ? 'default' : 'subtle'}
      color="gray"
      size={size}
      radius="xl"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => toggleColorScheme()}
      styles={
        chip
          ? {
              root: {
                background: 'var(--app-surface)',
                borderColor: 'var(--app-border)',
                color: 'var(--app-text)',
              },
            }
          : undefined
      }
    >
      <motion.div
        layout
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
      </motion.div>
    </ActionIcon>
  );
}
