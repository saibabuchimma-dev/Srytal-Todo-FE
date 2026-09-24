import { MantineProvider as MantineProviderBase } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';
import type { MantineProviderProps as BaseMantineProviderProps } from '@mantine/core';

import { theme } from '@/theme';

type MantineProviderProps = BaseMantineProviderProps & {
  children: ReactNode;
};

export function MantineProvider({ children, ...props }: MantineProviderProps) {
  return (
    <MantineProviderBase theme={theme} {...props}>
      {children}
    </MantineProviderBase>
  );
}
