import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export type BadgeProps = MantineBadgeProps;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant = 'light', color = 'blue', ...props }, ref) => {
    return (
      <MantineBadge
        ref={ref}
        radius="xl"
        variant={variant}
        color={color}
        fw={600}
        size="sm"
        {...props}
      >
        {children}
      </MantineBadge>
    );
  },
);

Badge.displayName = 'Badge';
export default Badge;
