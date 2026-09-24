import {
  Card as MantineCard,
  type CardProps as MantineCardProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export interface CardProps extends MantineCardProps {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, hoverable = false, glass = false, className, style, ...props },
    ref,
  ) => {
    return (
      <MantineCard
        ref={ref}
        radius="lg"
        shadow="sm"
        withBorder
        className={`${className ?? ''} ${hoverable ? 'card-lift' : ''} ${glass ? 'glass' : ''}`.trim()}
        style={{
          backgroundColor: glass ? 'var(--app-glass-bg)' : 'var(--app-surface)',
          borderColor: glass ? 'var(--app-glass-border)' : 'var(--app-border)',
          ...style,
        }}
        {...props}
      >
        {children}
      </MantineCard>
    );
  },
);

Card.displayName = 'Card';
export default Card;
