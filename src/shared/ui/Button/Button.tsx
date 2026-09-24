import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export interface ButtonProps extends MantineButtonProps {
  gradientVariant?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, loading, variant = 'filled', className, style, ...props },
    ref,
  ) => {
    return (
      <MantineButton
        ref={ref}
        radius="md"
        size="sm"
        fw={600}
        variant={variant}
        loading={loading}
        className={className}
        style={{
          transition:
            'transform 150ms ease-out, box-shadow 150ms ease-out, background-color 150ms ease-out',
          ...style,
        }}
        {...props}
      >
        {children}
      </MantineButton>
    );
  },
);

Button.displayName = 'Button';
export default Button;
