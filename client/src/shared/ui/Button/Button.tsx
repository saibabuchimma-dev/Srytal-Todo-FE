import { Button as MantineButton } from '@mantine/core';
import type { ButtonProps } from '@mantine/core';

export default function Button(props: ButtonProps) {
  return <MantineButton radius="md" size="md" fw={600} {...props} />;
}
