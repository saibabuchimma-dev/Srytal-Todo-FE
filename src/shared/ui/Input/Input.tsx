import {
  TextInput as MantineTextInput,
  type TextInputProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export type InputProps = TextInputProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <MantineTextInput
        ref={ref}
        radius="md"
        size="sm"
        error={error}
        className={className}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
export default Input;
