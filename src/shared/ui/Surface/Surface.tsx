import { Box } from '@mantine/core';
import type { BoxProps } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';

import { token } from '@/theme/tokens';

interface SurfaceProps extends Omit<BoxProps, 'style'> {
  children: ReactNode;
  level?: 'base' | 'raised';
  withBorder?: boolean;
  style?: CSSProperties;
}

export default function Surface({
  children,
  level = 'base',
  withBorder = true,
  style,
  ...rest
}: SurfaceProps) {
  return (
    <Box
      {...rest}
      style={{
        backgroundColor: level === 'raised' ? token.surface2 : token.surface,
        color: token.text,
        border: withBorder ? `1px solid ${token.border}` : undefined,
        borderRadius: 'var(--mantine-radius-lg)',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
