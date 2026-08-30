import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

interface ThemeToggleProps {
  /** Diameter of the button. */
  size?: number;
  /** Adds a surface background + border so it stands out over any panel. */
  chip?: boolean;
}

/**
 * Reusable light/dark theme toggle. Shared by the dashboard header and the
 * login screen so the control looks and behaves identically everywhere.
 */
export default function ThemeToggle({ size = 40, chip = false }: ThemeToggleProps) {
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
      {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
    </ActionIcon>
  );
}
