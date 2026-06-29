import { TextInput } from '@mantine/core';
import type { TextInputProps } from '@mantine/core';

export default function Input(props: TextInputProps) {
  return <TextInput radius="md" size="md" {...props} />;
}
