import { Modal, Stack, Group, Button } from '@mantine/core';
import type { ReactNode } from 'react';

interface FormModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: () => void;
}

export default function FormModal({
  opened,
  onClose,
  title,
  children,
  loading = false,
  submitLabel = 'Save',
  onSubmit,
}: FormModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} centered title={title} size="md" radius="md">
      <Stack>
        {children}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>

          <Button loading={loading} onClick={onSubmit}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
