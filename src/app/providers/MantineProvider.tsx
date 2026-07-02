import { MantineProvider as MantineProviderBase, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
});

type MantineProviderProps = {
  children: ReactNode;
};

export function MantineProvider({ children }: MantineProviderProps) {
  return <MantineProviderBase theme={theme}>{children}</MantineProviderBase>;
}
