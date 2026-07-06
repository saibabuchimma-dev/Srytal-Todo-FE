import { Modal, Stack, Text, Group, Button } from '@mantine/core';

interface ConfirmDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  loading = false,
  title = 'Delete',
  message = 'Are you sure you want to delete this item?',
}: ConfirmDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} centered size="sm" title={title} radius="md">
      <Stack>
        <Text>{message}</Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>

          <Button color="red" loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
